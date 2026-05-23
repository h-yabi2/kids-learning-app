# VOICEVOX TTS 移行設計

## 背景と目的

現状、`/api/tts` 経由で Google Cloud Text-to-Speech (`ja-JP-Neural2-C`) を都度呼び出している。
以下の課題がある。

- **音声クオリティが低い**（子供向けに最適化しきれていない）
- **読み上げ開始までのラグ**（Vercel Function 経由で都度合成）
- **従量課金が発生**（Neural2 は文字数ベース）

これを **VOICEVOX（青山龍星）** に置き換える。本番が Vercel デプロイのためエンジン常駐は不可。
代わりに **全フレーズを事前生成して `public/voice/` に静的配置**し、クライアントは静的ファイルを再生する。

## 設計方針

### 全体像

```
[開発時]
  作業者の PC で VOICEVOX 起動 (localhost:50021)
        │
        ▼
  pnpm run gen:voice
        │
        ├─ 必要発話リストを全列挙 (lib/*-data.ts + 固定パターン)
        ├─ public/voice/<sha1>.mp3 に存在しないものだけ
        ├─ VOICEVOX /audio_query → /synthesis (WAV)
        ├─ ffmpeg で mp3 化
        └─ public/voice/<sha1>.mp3 保存 + manifest.json 更新
        │
        ▼
  git commit → Vercel デプロイ

[ランタイム]
  クライアント → /voice/<sha1>.mp3 (CDN, 静的) → 再生
```

### テキスト集合

| 種類 | パターン | 件数 | 由来 |
|---|---|---|---|
| ひらがな単語 | `HiraganaItem.word` | 約46 | `lib/hiragana-data.ts` |
| カタカナ単語 | `KatakanaItem.word` | 約46 | `lib/katakana-data.ts` |
| 花丸時 | `"よくできました！"` | 1 | コンポーネント固定 |
| 足し算 問題 | `"${num1}たす${num2}は？"` (1..10 × 1..10) | 100 | 全列挙 |
| 足し算 正解 | `"せいかい！${answer}"` (2..20) | 19 | 全列挙 |
| 足し算 不正解 | `"ちがいます。こたえは${answer}です。"` (2..20) | 19 | 全列挙 |

合計 約 231 件。1ファイル 20〜80KB の mp3 想定で、合計 5〜20MB 程度。

### コンポーネント構成

#### 1. 共通ヘルパ `lib/voice.ts`（新規）

```ts
// テキスト → 音声ファイルパス（hash化）
export function voicePath(text: string): string;
// テキストのプリロード（<link rel="preload"> 動的注入）
export function preloadVoice(texts: string[]): void;
// 再生（静的 mp3 → Audio）。失敗時 Web Speech フォールバック
export function speakText(text: string, opts?: { lang?: string }): Promise<void>;
```

- ハッシュは `sha1(text)` の先頭 16hex（衝突なし＆ファイル名短縮）
- ハッシュ関数は **Node 側（生成スクリプト）とブラウザ側で同一**にする
  → `lib/voice-hash.ts` に切り出し、Web Crypto / Node crypto の両対応 or 共通の純 JS 実装

#### 2. 列挙ロジック `scripts/voice-texts.ts`（新規）

各シーンで使われる全テキストを返す純関数。

```ts
export function listAllVoiceTexts(): string[];
```

生成スクリプトと「実行時 manifest 生成」両方から使えるようにする。

#### 3. 生成スクリプト `scripts/generate-voice.ts`（新規）

- Node スクリプト（`tsx` で実行）
- `VOICEVOX_URL`（既存 .env.local の値）と `VOICEVOX_SPEAKER_ID` を環境変数で受け取る
- 流れ:
  1. `listAllVoiceTexts()` で全テキスト取得
  2. 各テキストに対し `voicePath(text)` を計算
  3. 既存ファイルがあればスキップ
  4. なければ `POST /audio_query?text=...&speaker=...` → `POST /synthesis?speaker=...` (WAV)
  5. `ffmpeg -i - -codec:a libmp3lame -q:a 4 out.mp3` で mp3 化（child_process.spawn でパイプ）
  6. `public/voice/<hash>.mp3` に保存
  7. `public/voice/manifest.json` に `{ [hash]: text }` を出力（デバッグ用）
- **冪等**: 既存ファイルがあればスキップ、新規分だけ追加

`package.json` に追加:
```json
"scripts": {
  "gen:voice": "tsx scripts/generate-voice.ts"
}
```

#### 4. 既存シーンの差し替え

`hiragana-scene.tsx`, `katakana-scene.tsx`, `addition-scene.tsx` の各 `speakText` を
共通ヘルパ `lib/voice.ts` の `speakText` に置き換える。
ローカル定義された `audioCache` Map とフォールバック分岐は共通ヘルパに集約。

各シーンマウント時、表示候補のテキストを `preloadVoice([...])` で先読み（ラグゼロ化）。

- ひらがな/カタカナシーン: 全 46 + 共通フレーズを preload
- 足し算シーン: 1..10×1..10 の問題文と正解/不正解フレーズを preload

#### 5. `/api/tts` の削除

- `app/api/tts/route.ts` 削除
- `@google-cloud/text-to-speech` 依存を `package.json` から削除
- `.env.local` の `GOOGLE_*` 関連も不要（コミット対象外なので作業者が手動削除）

#### 6. クレジット表記

VOICEVOX 利用規約に従い、UI に明示する。

- 設置場所: トップページのフッター
- 文言: `音声: VOICEVOX:青山龍星`
- リンク: https://voicevox.hiho.jp/

## エラーハンドリング

| 状況 | 動作 |
|---|---|
| 静的 mp3 が 404（生成漏れ） | `console.warn` + Web Speech API フォールバック |
| Audio.play() 失敗（autoplay制限等） | ユーザー操作起点で再試行、無音許容 |
| 生成スクリプト中の VOICEVOX 接続失敗 | 明確なエラー + 起動手順をログ出力して exit 1 |
| 生成スクリプト中の ffmpeg 不在 | preflight チェックで早期 exit |

## 開発者ワークフロー

### 初回セットアップ

1. VOICEVOX エンジン起動（Docker 推奨）
   ```bash
   docker run --rm -p 50021:50021 voicevox/voicevox_engine:cpu-latest
   ```
2. ffmpeg インストール（`brew install ffmpeg`）
3. `.env.local` に以下を追加（既存）
   ```
   VOICEVOX_URL=http://localhost:50021
   VOICEVOX_SPEAKER_ID=13  # 青山龍星のスタイル ID（要確認・固定）
   ```
4. `pnpm install`（tsx 追加）
5. `pnpm run gen:voice`

### 単語/フレーズ追加時

1. `lib/hiragana-data.ts` などに項目追加
2. `pnpm run gen:voice`（差分のみ生成）
3. `git add public/voice/ lib/...` → コミット

## 検証

- [ ] 全フレーズの mp3 が `public/voice/` に存在する
- [ ] `dev` 起動でひらがなシーン: 文字タップ → 即座に読み上げ
- [ ] カタカナシーン: 同上
- [ ] 足し算シーン: 問題表示と同時に問題文読み上げ、回答後に正解/不正解読み上げ
- [ ] 花丸表示時に「よくできました！」読み上げ
- [ ] ネットワーク制限環境で 2回目以降が確実にキャッシュ再生される
- [ ] `/api/tts` が 404 を返す（削除完了確認）
- [ ] フッターに VOICEVOX クレジット表示

## YAGNI で除外したもの

- **CI での自動生成**: 手動運用で十分。差分検知も後回し
- **複数話者切替**: 青山龍星固定
- **速度/ピッチの UI 調整**: 生成時固定（必要なら後で再生成）
- **テキストの動的合成（未知の文字列）**: フォールバック Web Speech で許容
