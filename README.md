# フルスタ打

IT エンジニアの社内チャット返信を、ローマ字で打ち返すタイピングゲームです。

株式会社カオスワークスの Slack 風チャットに届いたメッセージへ、用意された返信を正確かつ速く入力します。スコアはゲーム内年収。制限時間は 60 秒です。

## 遊び方

1. 難易度を選ぶ（初級 / 中級 / 上級）
2. 表示された返信をローマ字で入力する（正しいキーだけ進む。一般的なローマ字の揺れは許容）
3. 1 通打ち切ると自動送信され、年収が加算される
4. 時間切れで結果。同じブラウザの累計は分析画面で確認できる

ログインはありません。初回アクセス時に匿名の `playerId`（UUID）だけをブラウザへ保存します。氏名・メールなどの個人情報は扱いません。プレイ中のキー入力は API に送らず、終了時にまとめて保存します。

## 技術構成

単一リポジトリ・単一 [Cloudflare Worker](https://developers.cloudflare.com/workers/)。

| 層 | 内容 |
| --- | --- |
| フロント | React + TypeScript（[Vite+](https://viteplus.dev/guide/)） |
| API | [Hono](https://hono.dev/)（同一 Worker） |
| データ | Cloudflare D1（ローカルと本番を分離） |
| デプロイ | Wrangler（CI なし） |

## 必要環境

- WSL2（リポジトリは Linux ファイルシステム上。`/mnt/c` 配下は使わない）
- [Nix](https://nixos.org/) と [direnv](https://direnv.net/)
- [Vite+](https://viteplus.dev/guide/) の `vp`（`curl -fsSL https://vite.plus | bash`）
- Cloudflare アカウント（デプロイ時）

## セットアップ

```bash
direnv allow
vp install
just db-migrate
just db-seed
just dev
```

開発サーバはローカル D1 を使います。

## コマンド

| コマンド | 内容 |
| --- | --- |
| `just dev` | ローカル開発サーバ |
| `just check` | lint / typecheck / test / build |
| `just db-migrate` | ローカル D1 に migration を適用 |
| `just db-seed` | ローカル D1 に問題データを投入 |
| `just db-migrate-remote` | 本番 D1 に migration を適用 |
| `just deploy` | 本番 D1 の migration・seed 後に Worker へデプロイ |
| `just types` | Wrangler の型生成 |

D1 の schema 変更は `migrations/` のみ。ローカル（`--local`）と本番（`--remote`）を混ぜないでください。

## ドキュメント

- 現行仕様: [`docs/specs/mvp.md`](docs/specs/mvp.md)
- 完成判定: [`docs/tasks/mvp_acceptance_checklist.md`](docs/tasks/mvp_acceptance_checklist.md)
- エージェント向けメモ: [`AGENTS.md`](AGENTS.md)
