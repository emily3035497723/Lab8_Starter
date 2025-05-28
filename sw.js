// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts

const CACHE_NAME = 'lab-8-starter';

// Installs the service worker. Feed it some initial URLs to cache
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // B6. TODO - Add all of the URLs from RECIPE_URLs here so that they are
      //            added to the cache when the ServiceWorker is installed
      const filesToCache = [     
        'index.html',
        'assets/scripts/main.js',
        'assets/styles/main.css',
        'assets/components/RecipeCard.js',
        'assets/images/5-star.svg',
        'assets/images/4-star.svg',
        'assets/images/cornbread-stuffing.jpg',
        'assets/images/thanksgiving-side-dishes.jpg',
        'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
        'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json'
      ];
      
      for (const url of filesToCache) {
        try {
          await cache.add(url);
        } catch (err) {
          console.error('❌ B6 cache.add 失敗 →', url, err);
        }
      }// B6
    })
      /* 一次性加入 Cache ‧ 若有 404 / CORS 會整包失敗 ------------ */
      //return cache.addAll(filesToCache); 

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
  event.respondWith(                                                // B7
    caches.match(event.request).then(cached => {                    // B7
      if (cached) {                                                 // B8
        return cached;                                              // B8  →  回傳快取
      }                                                             // B8
      return fetch(event.request).then(res => {                     // B8
        return caches.open(CACHE_NAME).then(cache => {              // B8
          cache.put(event.request, res.clone());                    // B8  →  動態快取
          return res;                                               // B8  →  回傳網路資源
        });                                                         // B8
      });                                                           // B8
    })                                                              // B7
  );
});