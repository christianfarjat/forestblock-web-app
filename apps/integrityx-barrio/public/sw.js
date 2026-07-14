/*
 * Service worker mínimo (PWA offline-first básico).
 * Cachea el shell y assets estáticos con estrategia stale-while-revalidate;
 * las páginas navegadas caen a la última copia cacheada si no hay red.
 * En modo demo los datos viven en localStorage, así que la carga de
 * registros funciona sin señal; con API real se agrega cola outbox (Fase 2).
 */
const CACHE = 'ixb-shell-v1';
const PRECACHE = ['/', '/manifest.webmanifest', '/icons/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const network = fetch(request)
        .then((response) => {
          if (response.ok && (response.type === 'basic' || response.type === 'default')) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => undefined);

      if (cached) {
        network.catch(() => undefined);
        return cached;
      }
      const fresh = await network;
      if (fresh) return fresh;
      if (request.mode === 'navigate') {
        const shell = await cache.match('/');
        if (shell) return shell;
      }
      return Response.error();
    })
  );
});
