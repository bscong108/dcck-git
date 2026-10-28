/* Service worker: giữ khung ứng dụng và bài đã tải để đọc khi không có mạng. */
var VO = 'litfl-vo-v1';
var DU_LIEU = 'litfl-du-lieu-v1';
var KHUNG = ['./', 'index.html', 'app/style.css', 'app/kho.js', 'app/app.js', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VO).then(function (c) { return c.addAll(KHUNG); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== VO && k !== DU_LIEU; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function mangTruoc(req, ten) {
  return fetch(req).then(function (r) {
    if (r.ok) { var c = r.clone(); caches.open(ten).then(function (k) { k.put(req, c); }); }
    return r;
  }).catch(function () { return caches.match(req, { ignoreSearch: false }).then(function (r) { return r || caches.match(req, { ignoreSearch: true }); }); });
}
function boNhoTruoc(req) {
  return caches.match(req).then(function (r) {
    return r || fetch(req).then(function (r2) {
      if (r2.ok || r2.type === 'opaque') { var c = r2.clone(); caches.open(DU_LIEU).then(function (k) { k.put(req, c); }); }
      return r2;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var u = new URL(req.url);
  if (u.origin === location.origin) {
    if (/\/data\/muc-luc\.json$/.test(u.pathname)) return e.respondWith(mangTruoc(req, DU_LIEU));
    if (/\/data\/(bai|tv|anh)\//.test(u.pathname)) return e.respondWith(boNhoTruoc(req));
    return e.respondWith(mangTruoc(req, VO));   // khung: lấy bản mới nếu có mạng
  }
  if (req.destination === 'image') return e.respondWith(boNhoTruoc(req));   // ảnh trên litfl.com
});
