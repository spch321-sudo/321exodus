/* 321出埃及記講義 · Service Worker（離線可用）
   版本字串在每次 make_site.py 重新打包時都會變，
   一變就會清掉舊快取、重新抓一份新的，使用者不必手動清除。 */
const V = '出埃及記-gx20261016220011-tri10171929-gxa1019-gx1021c-vp1023-co1-gp1103-au1103-xz1103-xf1103-xm1103-vk1103-rf1105';
const PFX = '出埃及記-';   /* 同一個 github.io 網域共用 Cache Storage：只清自己的前綴 */
const NC = u => ({ cache: new URL(u).origin === self.location.origin ? 'no-cache' : 'default' });
const SHELL = [
  './', './index.html', './en.html', './sc.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png',
  './icon-180.png', './icon-167.png',
  './icon-152.png', './icon-120.png',
  './icon-64.png', './favicon.ico', './xz2.js', './coread.js', './peerjs.min.js'];

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
  const url = new URL(r.url);
  if (url.origin !== self.location.origin) return;
  /* -rf1105：網頁與程式走 shellFetch（慢網路先用快取）；version.json 維持網路優先，不可拿快取先頂 */
  if (true && !url.pathname.endsWith('/version.json') && (r.mode === 'navigate' || url.pathname.endsWith('/') || /\.(html|js|json)$/i.test(url.pathname))) {
    e.respondWith(shellFetch(r, r.mode === 'navigate'));
    return;
  }
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
/* -rf1105（互動聖經 v2.58.3）：網頁與程式 network-first，但網路超過 SHELL_WAIT（1 秒）還沒回應，
   且「自己這一版」的快取裡有同一份，就先用快取開起來；網路那份繼續下載並更新快取。
   弱網路不必乾等。只有導覽請求才可以退回 index.html，程式檔絕不拿網頁頂替。
   快取只查自己這個 App 的 CACHE（同網域底下還有很多 App）。 */
const SHELL_WAIT = 1000;
async function shellFetch(req, nav) {
  const net = fetch(req, { cache: 'no-cache' }).then(res => {
    if (res && res.ok && res.status === 200 && res.type !== 'opaque') {
      const copy = res.clone();
      caches.open(V).then(c => c.put(req, copy)).catch(() => {});
    }
    return res;
  });
  const own = () => caches.open(V).then(c => c.match(req, { ignoreSearch: true }));
  try {
    const first = await Promise.race([net, new Promise(ok => setTimeout(() => ok(null), SHELL_WAIT))]);
    if (first) return first;
    const hit = await own();
    if (hit) { net.catch(() => {}); return hit; }
    return await net;
  } catch (err) {
    let hit = await own();
    if (!hit && nav) hit = await caches.match('./index.html');
    if (hit) return hit;
    throw err;
  }
}

self.addEventListener('message', e => {
  const d = e.data;
  if (d === 'skip' || (d && (d.type === 'SKIP_WAITING' || d.t === 'skip'))) self.skipWaiting();
});
