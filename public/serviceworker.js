// Service workers run when you first time visit page and continue running even if the page was closed

// Storage of browser. Once you loaded image you don`t load it again, it stays in the cache
const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;
// Installation SW
// self - service worker
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("OPEN CACHE");
      return cache.addAll(urlsToCache);
    })
  );
});
// Listen for req
self.addEventListener("fetch", (e) => {
  // When fetch request is called, for example for an image,
  // this function fires and match all requests and sends them
  // and if there is no internet connection, requests go to offlime.html
  e.respondWith(
    caches
      .match(e.request)
      .then(() => {
        return fetch(e.request);
      })
      .catch((err) => {
        return caches.match("offline.html");
      })
  );
});
// Activate SW
self.addEventListener("activate", (e) => {
  // Remove previous caches and make new one, keeping only version we need
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
