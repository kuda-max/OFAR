const CACHE_NAME = "OFAR-v1";

const ASSETS = [
  "/",
  "/index.html",

  // CSS
  "/css/chat.css",
  "/css/main.css",
  "/css/style.css",

  // JS
  "/js/app.js",
  "/js/auth.js",
  "/js/dom.js",
  "/js/emojis.js",
  "/js/messages.js",
  "/js/presence.js",
  "/js/state.js",
  "/js/storage.js",
  "/js/supabase.js",
  "/js/theme.js",
  "/js/ti.js",
  "/js/ui.js",
  "/js/uploads.js",

  // Assets
  "/assets/ringtone.wav",

  // Manifest + icons
  "/Manifest/manifest.json",
  "/Manifest/icon-192.png",
  "/Manifest/icon-512.png"
];

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache =>
        cache.addAll(ASSETS)
      )

  );

});

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>

      Promise.all(

        keys.map(key => {

          if (key !== CACHE_NAME) {

            return caches.delete(key);

          }

        })

      )

    )

  );

});

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        return response || fetch(event.request);

      })

  );

});