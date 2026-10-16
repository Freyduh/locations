# GTA V map: setup (about 15 minutes, all free)

## 1. GitHub
1. Create a public repository, e.g. `gta5-map`.
2. Upload everything in this folder (keep the `.github` folder, `photos`, `locations.json`, `index.html`, `worker`).
3. Settings > Pages > Deploy from branch > `main` / root. Your site is `https://YOURNAME.github.io/gta5-map/`.
4. Settings > Actions > General > Workflow permissions > **Read and write permissions**.
5. Create two labels in Issues > Labels: `pending` and `approved`.
6. Create a token: Settings (your profile) > Developer settings > Fine-grained tokens. Repository access: only this repo. Permission: **Issues: Read and write**. Copy it.

## 2. Cloudflare relay
1. cloudflare.com > Workers & Pages > Create > Worker. Paste in `worker/worker.js` and deploy.
2. Worker > Settings > Variables:
   - `GITHUB_TOKEN` (encrypt it): the token from above
   - `REPO`: `YOURNAME/gta5-map`
   - `ALLOWED_ORIGIN`: `https://YOURNAME.github.io` (no trailing slash, no path)
3. Copy the worker URL (like `https://gta-map.YOURNAME.workers.dev`).

## 3. Connect the page
Open `index.html`, set `RELAY_URL` to the worker URL, and commit.

## Day to day
Someone adds a location, so GitHub emails you a new issue. Check the picture link, then add the **approved** label. In about a minute the picture is saved into `photos/`, the star is added to `locations.json`, and the page shows it for everyone. To reject one, just close the issue.
To remove a star later, delete its entry from `locations.json`.

Notes: `locations.json` loads from a web server, so opening `index.html` straight from your computer shows no stars. Test on GitHub Pages.
