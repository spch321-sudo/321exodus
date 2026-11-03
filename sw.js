/* 321出埃及記講義 · Service Worker（離線可用）
   版本字串在每次 make_site.py 重新打包時都會變，
   一變就會清掉舊快取、重新抓一份新的，使用者不必手動清除。 */
const V = '出埃及記-gx20261016220011-tri10171929-gxa1019-gx1021c-vp1023-co1-gp1103-au1103';
const PFX = '出埃及記-';   /* 同一個 github.io 網域共用 Cache Storage：只清自己的前綴 */
const NC = u => ({ cache: new URL(u).origin === self.location.origin ? 'no-cache' : 'default' });
const SHELL = [
  './', './index.html', './en.html', './sc.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png',
  './icon-180.png', './icon-167.png',
  './icon-152.png', './icon-120.png',
  './icon-64.png', './favicon.ico', './coread.js', './peerjs.min.js'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c => Promise.all(SHELL.map(u => fetch(new Request(u, { cache: 'reload' })).then(r => (r && r.ok) ? c.put(u, r) : null).catch(() => {})))).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V && k.indexOf(PFX) === 0).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* 只接管自己網域的 GET。
   策略是「網路優先、失敗才用快取」——更新內容會馬上看到，斷線也還能讀。 */
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  if (new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(r, NC(r.url))
      .then(resp => {
        const copy = resp.clone();
        caches.open(V).then(c => c.put(r, copy)).catch(() => {});
        return resp;
      })
      .catch(() => caches.match(r).then(hit => hit || caches.match('./index.html')))
  );
});
self.addEventListener('message', e => {
  const d = e.data;
  if (d === 'skip' || (d && (d.type === 'SKIP_WAITING' || d.t === 'skip'))) self.skipWaiting();
});
