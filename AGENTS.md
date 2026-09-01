# フルスタ打 — agent notes

単一 Cloudflare Worker（React SPA + Hono API + D1）。JS の lint / format / test / build / パッケージ管理は Vite+（`vp`）に任せる。日常コマンドは `justfile` 経由。

## コマンド

- `just dev` — 開発サーバ（ローカル D1）
- `just check` — lint / typecheck / test / build
- `just db-migrate` / `just db-seed` — ローカル D1
- `just deploy` — リモート migration のあと Wrangler デプロイ

## 守ること

- プレイ中のキー入力を API に送らない。結果は終了時にまとめて `POST /api/plays`
- 匿名 `playerId`（UUID）のみ。個人情報を保存しない。ログインを追加しない
- D1 変更は `migrations/` のみ。ローカルと本番を混ぜない（`--local` / `--remote`）
- 仕様は `docs/specs/mvp.md`。完成判定は `docs/tasks/mvp_acceptance_checklist.md`
- コミットメッセージ: `[type]: [日本語] [gitmoji]`

## 公式スキル

`.cursor/skills/` には各技術の公式配布スキルのみを置く。
