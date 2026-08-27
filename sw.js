/**
 * Service worker mínimo.
 * Solo existe porque Android exige uno para ofrecer "Instalar aplicación".
 * Guarda el envoltorio y los íconos; la app en sí siempre viene de Google,
 * porque necesita conexión para leer y escribir en la planilla.
 */

var CACHE = 'gastos-envoltorio-v1';
var ARCHIVOS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(claves.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);

  // Todo lo de Google va directo a la red, sin tocar la caché.
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    fetch(e.request).catch(function () { return caches.match(e.request); })
  );
});
