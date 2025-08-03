# デプロイ手順

## 1. VOICEVOX ENGINEをRenderにデプロイ

1. [Render.com](https://render.com) にアカウント作成・ログイン
2. GitHubリポジトリと連携
3. 「New Web Service」から以下を設定：
   - Repository: このプロジェクト
   - Docker Build: `voicevox.dockerfile`
   - Plan: Free
   - Environment Variables:
     - `VOICEVOX_CORS_POLICY_MODE=1`

4. デプロイ完了後、URLをメモ（例: `https://voicevox-engine-xxx.onrender.com`）

## 2. メインアプリをVercelにデプロイ

1. Vercel CLIでログイン:
   ```bash
   npx vercel login
   ```

2. プロジェクトをデプロイ:
   ```bash
   npx vercel --prod
   ```

3. 環境変数を設定:
   ```bash
   npx vercel env add VOICEVOX_URL
   # RenderのVOICEVOX ENGINE URLを入力
   ```

## 3. 環境変数の設定

### Vercel Dashboard
- `VOICEVOX_URL`: `https://your-voicevox-engine.onrender.com`

### ローカル開発用 (.env.local)
```
VOICEVOX_URL=http://localhost:50021
```

## 4. 動作確認

1. Vercelのデプロイが完了
2. アプリにアクセスして音声機能をテスト
3. ブラウザの開発者ツールでネットワークタブを確認

## トラブルシューティング

### CORS エラーが発生する場合
- RenderのVOICEVOX ENGINEで`VOICEVOX_CORS_POLICY_MODE=1`が設定されているか確認

### 音声生成が遅い場合
- Renderの無料プランでは初回リクエストが遅い（スリープから復帰）
- 有料プランへのアップグレードを検討