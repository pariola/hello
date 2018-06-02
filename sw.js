importScripts("https://js.pusher.com/4.2/pusher.worker.min.js");

const cacheName = "sw_v1";
const cacheFiles = [
  "./",
  "./index.html",
  "./hello.html",
  "./css/index.css",
  "./css/chat.css",
  "./js/chat.js",
  "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/preact/8.2.9/preact.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
  "https://unpkg.com/axios/dist/axios.min.js",
  "https://js.pusher.com/4.2/pusher.worker.min.js"
];

// ? Listen for INSTALL event
this.addEventListener("install", e => {
  console.log(`[SW] installed`);
  // ? Cache Files
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("[SW] caching files");
      return cache.addAll(cacheFiles);
    })
  );
});

// ? Listen for ACTIVATE event
this.addEventListener("activate", e => {
  console.log(`[SW] activated`);
  e.waitUntil(clients.claim());

  // ? Clear all old caches
  caches.keys().then(keys => {
    return Promise.all(
      keys.map(key => {
        if (key !== cacheName) {
          console.log("[SW] deleting caches from Cache:", key);
          return caches.delete(key);
        }
      })
    );
  });
});

// ? Listen for FETCH events
this.addEventListener("fetch", e => {
  // console.log(`[SW] fetch called on ${e.request.url}`);
  e.respondWith(
    caches.match(e.request).then(res => {
      return res
        ? res
        : fetch(e.request).then(r => {
            if (e.request.url == "https://hello-me.herokuapp.com/chat") {
              // * Send Notification
              const options = { body: "data.message" };
              self.registration.showNotification(
                "New message(s) from Blessing 😉"
              );
            }
            return r;
          });
    })
  );
});

// ? Initialize Pusher
var pusher = new Pusher("10027214367a0301fd21", {
  cluster: "eu",
  encrypted: true
});

// ? Listen for PUSH events
var channel = pusher.subscribe("all");
channel.bind("notification", function(data) {
  const options = { body: data.message };
  self.registration
    .showNotification("Hello Blessing 😉", options)
    .then(() => self.registration.getNotifications())
    .then(notifications => {
      setTimeout(
        () => notifications.forEach(notification => notification.close()),
        4000
      );
    });
});
