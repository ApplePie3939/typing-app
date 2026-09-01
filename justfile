set shell := ["bash", "-eu", "-o", "pipefail", "-c"]

export PATH := env_var("HOME") + "/.local/share/vite-plus/bin:" + env_var("PATH")

db := "fullsta-uchi"
wrangler := "vp exec wrangler"

dev:
    vp dev

check:
    vp check
    vp test
    vp build

deploy:
    vp build
    {{wrangler}} d1 migrations apply {{db}} --remote
    just db-seed-remote
    {{wrangler}} deploy

db-migrate:
    {{wrangler}} d1 migrations apply {{db}} --local

db-migrate-remote:
    {{wrangler}} d1 migrations apply {{db}} --remote

db-seed: db-migrate
    vp node --experimental-strip-types scripts/build-seed.ts
    {{wrangler}} d1 execute {{db}} --local --file=seed/prompts.sql --yes

db-seed-remote:
    vp node --experimental-strip-types scripts/build-seed.ts
    {{wrangler}} d1 execute {{db}} --remote --file=seed/prompts.sql --yes

types:
    {{wrangler}} types
