// Cloudflare Worker: receives a submission and opens a "pending" GitHub issue.
// Settings (Worker > Settings > Variables):
//   GITHUB_TOKEN   (secret)  fine-grained token, Issues: read/write on your repo only
//   REPO           e.g. "yourname/gta5-map"
//   ALLOWED_ORIGIN e.g. "https://yourname.github.io"
export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST" || req.headers.get("Origin") !== env.ALLOWED_ORIGIN)
      return new Response("Forbidden", { status: 403, headers: cors });

    let d;
    try { d = await req.json(); } catch { return new Response("Bad request", { status: 400, headers: cors }); }
    if (d.website) return new Response("ok", { headers: cors }); // honeypot: bots fill this in

    const x = Number(d.x), y = Number(d.y);
    const title = String(d.title || "").replace(/[\r\n`]/g, " ").trim().slice(0, 80);
    const link = String(d.link || "").trim();
    if (!(x >= 0 && x <= 1 && y >= 0 && y <= 1) || !title || link.length > 500 || !/^https:\/\/\S+$/i.test(link))
      return new Response("Invalid", { status: 400, headers: cors });

    const body = "Review the picture link, then add the **approved** label to publish.\n\n" +
      "```json\n" + JSON.stringify({ x: +x.toFixed(4), y: +y.toFixed(4), title, link }) + "\n```\n\n" +
      "Picture: " + link;
    const r = await fetch(`https://api.github.com/repos/${env.REPO}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        "User-Agent": "gta-map-relay",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({ title: "New location: " + title, body, labels: ["pending"] }),
    });
    return new Response(r.ok ? "ok" : "Failed", { status: r.ok ? 200 : 502, headers: cors });
  },
};
