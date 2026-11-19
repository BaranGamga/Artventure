/* Artventure service worker.
   Her yeni sürümde VERSION değişir (version.json ile aynı). Telefon yeni sürümü indirir,
   kullanıcı "Güncelle"ye dokunana kadar eski sürüm çalışmaya devam eder. */
const VERSION = "1.1.1";
const CACHE = "artventure-" + VERSION;
const SHELL = ["./", "index.html", "styles.css", "app.js", "content.js", "kultur.js", "manifest.webmanifest", "icons/icon.webp", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(SHELL.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("artventure-") && k !== CACHE && k !== "artventure-fonts").map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("message", e => { if (e.data === "skipWaiting") self.skipWaiting(); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.pathname.endsWith("version.json") || url.hostname === "api.anthropic.com") return;
  if (url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com")) {
    e.respondWith(caches.open("artventure-fonts").then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }))));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }))));
});
