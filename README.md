# Securio

Static GitHub Pages playground for example responses from the Securio (ToolsAPI) RapidAPI endpoints.

## Setup

1. Add a repository secret named `RAPIDAPI_SECRET` under **Settings > Secrets and variables > Actions**.
2. Optionally add `RAPIDAPI_HOST` if your RapidAPI host differs from `toolsapi.p.rapidapi.com`.
3. Run **Actions > Generate Securio samples > Run workflow**.

The workflow also refreshes samples daily. Configure GitHub Pages to publish from the `docs` folder on the `main` branch.

## Local use

Requires Node.js 18 or newer. The command fetches live responses and commits updated JSON samples, so use a branch when testing locally:

```sh
RAPIDAPI_SECRET=your_key npm run fetch-samples
```
