// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // B6. TODO - Add all of the URLs from RECIPE_URLs here so that they are
      //            added to the cache when the ServiceWorker is installed
      return cache.addAll([
        '/Lab8_Starter/',
        '/Lab8_Starter/index.html',
        '/Lab8_Starter/assets/scripts/main.js',
        '/Lab8_Starter/assets/styles/main.css',
        '/Lab8_Starter/assets/components/RecipeCard.js',
        '/Lab8_Starter/assets/images/5-star.svg',
        '/Lab8_Starter/assets/images/4-star.svg',
        '/Lab8_Starter/assets/images/cornbread-stuffing.jpg',
        '/Lab8_Starter/assets/images/thanksgiving-side-dishes.jpg'
      ]);
    })
  );
});

// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // We added some known URLs to the cache above, but tracking down every
  // subsequent network request URL and adding it manually would be very taxing.
  // We will be adding all of the resources not specified in the intiial cache
  // list to the cache as they come in.
  /*******************************/
  // This article from Google will help with this portion. Before asking ANY
  // questions about this section, read this article.
  // NOTE: In the article's code REPLACE fetch(event.request.url) with
  //       fetch(event.request)
  // https://developer.chrome.com/docs/workbox/caching-strategies-overview/
  /*******************************/
  // B7. TODO - Respond to the event by opening the cache using the name we gave
  //            above (CACHE_NAME)

  // B8. TODO - If the request is in the cache, return with the cached version.
  //            Otherwise fetch the resource, add it to the cache, and return
  //            network response.
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        // B8 - 如果請求的資源在 cache 裡，就直接回傳
        return cachedResponse;
      }
  
      // B8 - 否則就去 fetch 資源
      return fetch(event.request).then(function (networkResponse) {
        return caches.open(CACHE_NAME).then(function (cache) {
          // 把抓回來的東西 clone 一份放進 cache
          cache.put(event.request, networkResponse.clone());
          return networkResponse; // 再回傳給頁面使用
        });
      });
    })
  );
});