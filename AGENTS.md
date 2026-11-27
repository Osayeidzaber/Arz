# Arz — Shopify Theme

This repo is a Shopify Online Store 2.0 theme. Theme folders (`assets`, `blocks`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`) live at the **repo root**, which Shopify's GitHub integration requires. Do not move them into a subfolder.

## Branches & Shopify connection

| Branch    | Purpose |
|-----------|---------|
| `main`    | Development. Work here or in feature branches. |
| `shopify` | Connected to the Shopify store via the Shopify GitHub integration. Whatever is on this branch is what the connected theme shows. |

**Connecting (one time, done in Shopify admin):** Online Store → Themes → Add theme → Connect from GitHub → choose `Osayeidzaber/Arz` → branch `shopify`.

**Deploying:** merge `main` into `shopify` and push:
```
git checkout shopify && git merge main && git push && git checkout main
```

## Rules for agents

- **Shopify writes back to the `shopify` branch.** Changes made in the theme editor (mostly `config/settings_data.json` and `templates/*.json`) get committed by Shopify automatically. Always `git pull` before editing, and merge `shopify` back into `main` regularly so those edits aren't overwritten.
- Don't hand-edit `config/settings_data.json` unless asked. The theme editor owns it.
- Keep the root clean. Shopify ignores files that aren't theme files (README, CLAUDE.md, AGENTS.md), but don't add build tooling folders without asking.
- Liquid/JSON must stay valid. A broken file makes Shopify reject the sync for that file.
- Never commit secrets (API tokens, `.env`).
