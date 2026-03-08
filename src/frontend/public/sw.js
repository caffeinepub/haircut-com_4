const CACHE_NAME = 'haircut-v11';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/assets/generated/pwa-icon-192.dim_192x192.png',
  '/assets/generated/pwa-icon-512.dim_512x512.png',
  '/assets/generated/category-men.dim_200x200.jpg',
  '/assets/generated/category-women.dim_200x200.jpg',
  '/assets/generated/category-kids.dim_200x200.jpg',
  '/assets/generated/category-unisex.dim_200x200.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url => cache.add(url).catch(() => {}))
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Network-first for API/canister calls
  if (url.pathname.startsWith('/api/') || url.hostname.includes('icp') || url.hostname.includes('ic0.app')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Cache-first for static assets (images, fonts, scripts, styles)
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          return new Response('', { status: 404 });
        });
      })
    );
    return;
  }

  // Network-first with offline fallback for navigation (SPA)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/').then((cached) => {
          if (cached) return cached;
          return new Response(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Haircut.com - Offline</title>
                <style>
                  body { font-family: sans-serif; background: #1a1a1a; color: #fff; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; flex-direction: column; gap: 16px; }
                  .logo { font-size: 2rem; font-weight: bold; color: #D4AF37; }
                  p { color: #aaa; text-align: center; max-width: 280px; }
                  button { background: #D4AF37; color: #1a1a1a; border: none; padding: 12px 24px; border-radius: 24px; font-size: 1rem; cursor: pointer; font-weight: bold; }
                  img { width: 80px; height: 80px; border-radius: 16px; }
                </style>
              </head>
              <body>
                <img src="/assets/generated/pwa-icon-192.dim_192x192.png" alt="Haircut.com" onerror="this.style.display='none'" />
                <div class="logo">Haircut.com</div>
                <p>You are offline. Please check your internet connection and try again.</p>
                <button onclick="window.location.reload()">Try Again</button>
              </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' },
          });
        });
      })
    );
    return;
  }

  // Default: network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
