# VOICEVOX TTS 移行 実装計画

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Google Cloud TTS を VOICEVOX（青山龍星）に置き換え、全フレーズを事前生成して `public/voice/<hash>.mp3` から再生する。ラグ解消・コスト 0 化・音声品質向上を達成する。

**Architecture:** ビルド前に Node スクリプト (`scripts/generate-voice.ts`) で全フレーズを VOICEVOX エンジン → mp3 化 → `public/voice/` に出力。クライアントは `lib/voice.ts` 経由で静的 mp3 を `<Audio>` で再生し、未生成時のみ Web Speech API にフォールバック。`/api/tts` と Google Cloud SDK 依存は削除する。

**Tech Stack:** Next.js 15 (App Router) / React 18 / TypeScript / VOICEVOX エンジン (Docker) / tsx / ffmpeg / FNV-1a hash

**設計書:** `docs/plans/2026-05-24-voicevox-tts-migration-design.md`

**実装戦略:** Subagent-Driven。下記の 3 つの「Subagent ブロック」単位でサブエージェントを起動。
各ブロック完了時にユーザーレビューを挟む。

---

## Subagent Block 1: 共通ロジック層

### Task 1: FNV-1a ハッシュ関数

**Files:**
- Create: `lib/voice-hash.ts`

**Why:** Node スクリプトとブラウザの両方でテキスト → ファイル名 (`<hash>.mp3`) を同じ結果で算出するため。SHA-1 は非同期 (`SubtleCrypto`) または重い純 JS 実装が必要なため、同期・短実装で済む FNV-1a を採用。

**Step 1: 実装**

```ts
// lib/voice-hash.ts
// FNV-1a 32bit hash. 同じ入力なら Node/Browser で常に同じ 8文字 hex を返す。
export function voiceHash(text: string): string {
  let hash = 0x811c9dc5;
  const bytes = new TextEncoder().encode(text);
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i];
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function voicePath(text: string): string {
  return `/voice/${voiceHash(text)}.mp3`;
}
```

**Step 2: 動作確認**

Run:
```bash
pnpm dlx tsx -e 'import { voiceHash, voicePath } from "./lib/voice-hash"; console.log(voiceHash("あ"), voiceHash("いぬ"), voicePath("よくできました！"));'
```

Expected: 3 つの 8文字 hex + `/voice/xxxxxxxx.mp3` 形式が表示される（具体的な値は計算結果次第、エラーなく出力されればOK）

**Step 3: コミット**

```bash
git add lib/voice-hash.ts
git commit -m "voice: FNV-1aハッシュ関数を追加（Node/Browser共通）"
```

---

### Task 2: 全フレーズ列挙ロジック

**Files:**
- Create: `lib/voice-texts.ts`

**Why:** 生成スクリプトとクライアントの preload 両方で「アプリ内で発話され得る全テキスト」を同じ集合として扱うため。

**Step 1: 既存データ確認**

Read: `lib/hiragana-data.ts`, `lib/katakana-data.ts` を読み、`item.word` を持つエクスポート配列名（例: `hiraganaData`, `katakanaData`）を確認。

**Step 2: 実装**

```ts
// lib/voice-texts.ts
import { hiraganaData } from "./hiragana-data";
import { katakanaData } from "./katakana-data";

// 1..10 × 1..10 の足し算問題
function additionTexts(): string[] {
  const out: string[] = [];
  for (let a = 1; a <= 10; a++) {
    for (let b = 1; b <= 10; b++) {
      out.push(`${a}たす${b}は？`);
    }
  }
  for (let ans = 2; ans <= 20; ans++) {
    out.push(`せいかい！${ans}`);
    out.push(`ちがいます。こたえは${ans}です。`);
  }
  return out;
}

// ひらがな/カタカナ各シーンで発話される単語
function characterWordTexts(): string[] {
  return [
    ...hiraganaData.map((i) => i.word),
    ...katakanaData.map((i) => i.word),
  ];
}

const FIXED_PHRASES = ["よくできました！"];

export function listAllVoiceTexts(): string[] {
  return Array.from(
    new Set([...characterWordTexts(), ...additionTexts(), ...FIXED_PHRASES])
  );
}

// シーン別 preload 用
export const hiraganaSceneTexts = (): string[] => [
  ...hiraganaData.map((i) => i.word),
  ...FIXED_PHRASES,
];
export const katakanaSceneTexts = (): string[] => [
  ...katakanaData.map((i) => i.word),
  ...FIXED_PHRASES,
];
export const additionSceneTexts = (): string[] => additionTexts();
```

⚠️ `hiraganaData` / `katakanaData` の実際のエクスポート名が異なる場合は Step 1 で確認した名前に合わせて修正。

**Step 3: 動作確認**

Run:
```bash
pnpm dlx tsx -e 'import { listAllVoiceTexts } from "./lib/voice-texts"; const t = listAllVoiceTexts(); console.log("total:", t.length); console.log(t.slice(0,5));'
```

Expected: `total: 200` 前後（230 前後）、最初の数件のテキストが表示される。

**Step 4: コミット**

```bash
git add lib/voice-texts.ts
git commit -m "voice: 発話テキスト列挙ロジックを追加"
```

---

### Task 3: クライアント共通ヘルパ

**Files:**
- Create: `lib/voice.ts`

**Why:** 各シーンの `speakText` 重複実装を排除し、静的 mp3 再生 + Web Speech フォールバック + preload を一元化する。

**Step 1: 実装**

```ts
// lib/voice.ts
import { voicePath } from "./voice-hash";

// 同一セッション内の Audio 再利用キャッシュ
const audioCache = new Map<string, HTMLAudioElement>();
const preloadedLinks = new Set<string>();

function fallbackToWebSpeech(text: string, lang = "ja-JP") {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.7;
  u.pitch = 1.2;
  u.volume = 0.9;
  window.speechSynthesis.speak(u);
}

export async function speakText(
  text: string,
  opts?: { lang?: string }
): Promise<void> {
  if (typeof window === "undefined") return;
  const url = voicePath(text);
  try {
    let audio = audioCache.get(url);
    if (!audio) {
      audio = new Audio(url);
      audio.preload = "auto";
      audioCache.set(url, audio);
    } else {
      // 連続再生のため先頭に戻す
      audio.currentTime = 0;
    }
    await audio.play();
  } catch (err) {
    console.warn("[voice] 静的mp3再生に失敗、Web Speechにフォールバック:", text, err);
    fallbackToWebSpeech(text, opts?.lang);
  }
}

export function preloadVoice(texts: string[]): void {
  if (typeof document === "undefined") return;
  for (const text of texts) {
    const url = voicePath(text);
    if (preloadedLinks.has(url)) continue;
    preloadedLinks.add(url);
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "audio";
    link.href = url;
    document.head.appendChild(link);
  }
}
```

**Step 2: 簡易確認**

Run: `pnpm tsc --noEmit` でビルドエラーがないことを確認。
Expected: エラーなし（既存コードのエラーは無視してよい。`lib/voice.ts` に関するエラーがないこと）

**Step 3: コミット**

```bash
git add lib/voice.ts
git commit -m "voice: クライアント共通speakText/preloadVoiceを追加"
```

---

## ✋ Subagent Block 1 完了 → ユーザーレビュー

レビューポイント:
- ハッシュが Node/Browser 同値になるか
- テキスト列挙の網羅性（後でデータ追加時の修正箇所が明確か）
- `speakText` のフォールバック仕様

---

## Subagent Block 2: 生成パイプライン

### Task 4: tsx 依存と npm script 追加

**Files:**
- Modify: `package.json`

**Step 1: 依存追加**

Run:
```bash
pnpm add -D tsx
```

Expected: `package.json` の devDependencies に `tsx` が追加される

**Step 2: scripts に追加**

`package.json` の `scripts` セクションに以下を追加:

```json
"gen:voice": "tsx scripts/generate-voice.ts"
```

**Step 3: 確認**

Run: `cat package.json | grep gen:voice`
Expected: 上記 1 行が表示される

**Step 4: コミット**

```bash
git add package.json pnpm-lock.yaml
git commit -m "voice: tsx依存とgen:voiceスクリプトを追加"
```

---

### Task 5: VOICEVOX speaker_id の確認

**Files:** なし（情報収集のみ）

**Why:** 青山龍星のスタイル ID は VOICEVOX エンジンに動的に問い合わせるのが確実。

**Step 1: VOICEVOX 起動確認**

ユーザーに以下を依頼:
```bash
docker run --rm -p 50021:50021 voicevox/voicevox_engine:cpu-latest
```
別ターミナルで:
```bash
curl -s http://localhost:50021/speakers | python3 -c "import sys, json; data=json.load(sys.stdin); [print(s['name'], [(st['name'], st['id']) for st in s['styles']]) for s in data if '青山' in s['name']]"
```
Expected: 青山龍星のスタイル名と speaker_id 一覧が出る（例: `ノーマル 13` など）

**Step 2: .env.local に追記**

ユーザーに依頼:
```
VOICEVOX_SPEAKER_ID=<確認した数値>
```

**Step 3:** コミット不要（環境変数は .gitignore 対象）

---

### Task 6: 生成スクリプト本体

**Files:**
- Create: `scripts/generate-voice.ts`
- Create: `public/voice/.gitkeep`（空ファイル）

**Why:** 設計の中核。冪等に動き、差分のみ生成する。

**Step 1: ffmpeg 存在確認の preflight 含めて実装**

```ts
// scripts/generate-voice.ts
import { mkdir, writeFile, access } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { voiceHash } from "../lib/voice-hash";
import { listAllVoiceTexts } from "../lib/voice-texts";

const VOICEVOX_URL = process.env.VOICEVOX_URL ?? "http://localhost:50021";
const SPEAKER_ID = process.env.VOICEVOX_SPEAKER_ID;
const OUT_DIR = resolve(process.cwd(), "public", "voice");

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function checkFfmpeg(): Promise<void> {
  await new Promise<void>((res, rej) => {
    const p = spawn("ffmpeg", ["-version"], { stdio: "ignore" });
    p.on("error", () => rej(new Error("ffmpeg が見つかりません。`brew install ffmpeg` 等でインストールしてください。")));
    p.on("exit", (code) => (code === 0 ? res() : rej(new Error("ffmpeg 実行に失敗"))));
  });
}

async function checkVoicevox(): Promise<void> {
  const res = await fetch(`${VOICEVOX_URL}/version`).catch(() => null);
  if (!res || !res.ok) {
    throw new Error(
      `VOICEVOX エンジン (${VOICEVOX_URL}) に接続できません。\n` +
        `Docker で起動: docker run --rm -p 50021:50021 voicevox/voicevox_engine:cpu-latest`
    );
  }
}

async function synthesizeWav(text: string): Promise<Buffer> {
  const queryRes = await fetch(
    `${VOICEVOX_URL}/audio_query?speaker=${SPEAKER_ID}&text=${encodeURIComponent(text)}`,
    { method: "POST" }
  );
  if (!queryRes.ok) throw new Error(`audio_query 失敗: ${text}`);
  const query = await queryRes.json();
  const synthRes = await fetch(`${VOICEVOX_URL}/synthesis?speaker=${SPEAKER_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "audio/wav" },
    body: JSON.stringify(query),
  });
  if (!synthRes.ok) throw new Error(`synthesis 失敗: ${text}`);
  return Buffer.from(await synthRes.arrayBuffer());
}

async function wavToMp3(wav: Buffer): Promise<Buffer> {
  return await new Promise((res, rej) => {
    const p = spawn("ffmpeg", [
      "-loglevel", "error",
      "-i", "pipe:0",
      "-codec:a", "libmp3lame",
      "-q:a", "4",
      "-f", "mp3",
      "pipe:1",
    ]);
    const chunks: Buffer[] = [];
    p.stdout.on("data", (c) => chunks.push(c));
    p.on("error", rej);
    p.on("exit", (code) =>
      code === 0 ? res(Buffer.concat(chunks)) : rej(new Error(`ffmpeg exit ${code}`))
    );
    p.stdin.end(wav);
  });
}

async function main() {
  if (!SPEAKER_ID) {
    throw new Error("VOICEVOX_SPEAKER_ID が未設定です。.env.local に設定してください。");
  }
  await checkFfmpeg();
  await checkVoicevox();
  await mkdir(OUT_DIR, { recursive: true });

  const texts = listAllVoiceTexts();
  console.log(`対象テキスト ${texts.length} 件 / speaker=${SPEAKER_ID}`);

  const manifest: Record<string, string> = {};
  let generated = 0;
  let skipped = 0;

  for (const text of texts) {
    const hash = voiceHash(text);
    manifest[hash] = text;
    const outPath = resolve(OUT_DIR, `${hash}.mp3`);
    if (await fileExists(outPath)) {
      skipped++;
      continue;
    }
    process.stdout.write(`[gen] ${hash} ${text.slice(0, 20)}…`);
    const wav = await synthesizeWav(text);
    const mp3 = await wavToMp3(wav);
    await writeFile(outPath, mp3);
    generated++;
    process.stdout.write(" ok\n");
  }

  await writeFile(
    resolve(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );

  console.log(`完了: 生成 ${generated} / スキップ ${skipped} / 合計 ${texts.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

**Step 2:** `.gitignore` の確認

Read `.gitignore` し、`public/voice/` が ignore されていないこと、または `*.mp3` が ignore されていないことを確認。
ignore されている場合は除外設定を追加（`!public/voice/`）。

**Step 3: `.env.local` ロード**

dev 環境では Next.js が自動ロードしてくれるが、tsx 単独実行では読まれない。ユーザーに以下のいずれかを依頼:
- 実行時に手動 export: `export $(cat .env.local | xargs) && pnpm run gen:voice`
- または `dotenv-cli` 追加: `pnpm add -D dotenv-cli` し scripts を `"gen:voice": "dotenv -e .env.local -- tsx scripts/generate-voice.ts"` に変更

→ 後者を採用（運用が確実）。Task 4 を遡って `dotenv-cli` 追加 + scripts 修正。

**Step 4: 実行**

Run:
```bash
pnpm run gen:voice
```

Expected:
- `対象テキスト 231 件 / speaker=13` のような表示
- 各テキストに `[gen] xxxxxxxx <prefix>… ok` が出る
- `完了: 生成 231 / スキップ 0 / 合計 231`
- `public/voice/` に 231 個程度の `.mp3` と `manifest.json` が生成される

**Step 5: 再実行で冪等性確認**

Run: `pnpm run gen:voice` をもう一度。
Expected: `完了: 生成 0 / スキップ 231 / 合計 231`

**Step 6: コミット**

```bash
git add scripts/generate-voice.ts public/voice/ package.json pnpm-lock.yaml
git commit -m "voice: 事前生成スクリプトと音声アセットを追加"
```

⚠️ mp3 のサイズが想定外に大きい場合（合計 50MB 超等）はビットレート見直し検討。

---

## ✋ Subagent Block 2 完了 → ユーザーレビュー

レビューポイント:
- 生成結果のサンプルを実際に再生して品質確認
- ファイル合計サイズが許容範囲か
- 冪等性が動くか

---

## Subagent Block 3: クライアント差し替え

### Task 7: hiragana-scene.tsx を共通ヘルパに差し替え

**Files:**
- Modify: `components/hiragana-scene.tsx`

**Step 1: 既存実装を確認**

該当行: 119-139 行に `speakText` 定義、`audioCache` ローカル Map あり。

**Step 2: 差し替え**

- import に `import { speakText, preloadVoice } from "@/lib/voice";` および `import { hiraganaSceneTexts } from "@/lib/voice-texts";` を追加（既存 import エイリアスのスタイルに合わせる）
- ローカルの `const audioCache = ...`、`const speakText = useCallback(...)`、その内部のフォールバック分岐を削除
- `useEffect` を 1 つ追加してマウント時 preload:
  ```ts
  useEffect(() => {
    preloadVoice(hiraganaSceneTexts());
  }, []);
  ```
- `speakText(item.word)` / `speakText(congratsText)` の呼び出しはそのまま（共通版も同一シグネチャ）

**Step 3: 確認**

Run: `pnpm tsc --noEmit`
Expected: `components/hiragana-scene.tsx` に関するエラーなし

Run: `pnpm dev` してブラウザで「ひらがな」シーンを開き、文字をタップ → 即座に VOICEVOX 青山龍星の音声で読み上げ。

Expected:
- 音声が VOICEVOX に切り替わっている
- 初回タップでもラグがほぼない（preload 済み）

**Step 4: コミット**

```bash
git add components/hiragana-scene.tsx
git commit -m "voice: hiraganaSceneを共通speakTextに差し替え"
```

---

### Task 8: katakana-scene.tsx を共通ヘルパに差し替え

**Files:**
- Modify: `components/katakana-scene.tsx`

**手順:** Task 7 と同様。`katakanaSceneTexts` を preload する点だけ異なる。

**動作確認:** カタカナシーンで同様に確認。

**コミット:**
```bash
git add components/katakana-scene.tsx
git commit -m "voice: katakanaSceneを共通speakTextに差し替え"
```

---

### Task 9: addition-scene.tsx を共通ヘルパに差し替え

**Files:**
- Modify: `components/addition-scene.tsx`

**手順:** Task 7 と同様。`additionSceneTexts` を preload。

**動作確認:** 足し算シーンで「N たす M は？」「せいかい！X」「ちがいます。こたえはXです。」のすべてが VOICEVOX 音声で再生されることを確認。

**コミット:**
```bash
git add components/addition-scene.tsx
git commit -m "voice: additionSceneを共通speakTextに差し替え"
```

---

### Task 10: フッターに VOICEVOX クレジット表示

**Files:**
- Modify: `app/page.tsx`（または `app/layout.tsx` — 表示箇所はトップに見えるもの。先に確認）

**Step 1: 現状確認**

Read `app/page.tsx` でフッター的な要素の有無を確認。なければ末尾に追加。

**Step 2: 追加**

```tsx
<footer className="w-full py-2 text-center text-xs text-gray-400">
  音声:{" "}
  <a
    href="https://voicevox.hiho.jp/"
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
  >
    VOICEVOX:青山龍星
  </a>
</footer>
```

レイアウトを壊さない位置に配置。タブ UI が `app/page.tsx` 直下にある想定。

**Step 3: 確認**

Run: `pnpm dev` でブラウザ表示、フッターが見えること。

**Step 4: コミット**

```bash
git add app/page.tsx
git commit -m "voice: VOICEVOXクレジット表示を追加"
```

---

### Task 11: /api/tts と Google Cloud TTS 依存を削除

**Files:**
- Delete: `app/api/tts/route.ts`
- Modify: `package.json`

**Step 1: API ルート削除**

Run:
```bash
rm app/api/tts/route.ts
```
（空ディレクトリになる場合は `app/api/tts/` も削除）

**Step 2: 依存削除**

Run:
```bash
pnpm remove @google-cloud/text-to-speech
```

**Step 3: 残存参照がないか確認**

Run:
```bash
grep -rn "api/tts\|@google-cloud/text-to-speech\|GOOGLE_CREDENTIALS_BASE64\|GOOGLE_CLOUD_PROJECT_ID" \
  app components lib hooks scripts 2>/dev/null
```
Expected: 何も出ない（または .env.local のみ — これは作業者が手動削除）

**Step 4: ビルド確認**

Run: `pnpm build`
Expected: エラーなし

**Step 5: コミット**

```bash
git add app package.json pnpm-lock.yaml
git commit -m "voice: Google Cloud TTS関連を削除"
```

---

## ✋ Subagent Block 3 完了 → 最終レビュー（verification-before-completion）

最終チェックリスト:
- [ ] `pnpm build` 成功
- [ ] `pnpm dev` 起動 → ひらがな / カタカナ / 足し算 すべてで VOICEVOX 音声が即時再生される
- [ ] 花丸表示時の「よくできました！」が再生される
- [ ] ネットワーク切断状態でも 2回目以降は再生できる（HTTP キャッシュ）
- [ ] フッターに VOICEVOX クレジット表示
- [ ] `/api/tts` が 404 を返す
- [ ] `grep` で `@google-cloud/text-to-speech` 参照が残っていない
- [ ] ユーザーに `.env.local` の `GOOGLE_*` を削除するよう案内

---

## 注意事項

- **DRY**: `speakText` は `lib/voice.ts` に 1 つだけ
- **YAGNI**: CI 自動生成 / 複数話者 / 速度 UI 調整は今回は作らない
- **コミット粒度**: 各 Task ごとに 1 コミット。サブエージェントはタスク完了即コミット
- **テスト**: 専用テストランナーは未導入のため、各タスクは「動作確認コマンド + 期待出力」を実行検証で代替
