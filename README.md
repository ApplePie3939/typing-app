# フルスタ打

IT エンジニアの社内チャット返信をローマ字で打ち返すタイピングゲームです。

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

## コマンド

| コマンド          | 内容                                        |
| ----------------- | ------------------------------------------- |
| `just dev`        | ローカル開発サーバ                          |
| `just check`      | lint / typecheck / test / build             |
| `just db-migrate` | ローカル D1 に migration を適用             |
| `just db-seed`    | ローカル D1 に問題データを投入              |
| `just deploy`     | 本番 D1 の migration 後に Worker へデプロイ |

詳細は `docs/specs/mvp.md` を参照。
