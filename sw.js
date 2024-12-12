importScripts("js/db.js");

const CACHE_ESTATICO = "cacheEstatico-v1";
const CACHE_DINAMICO = "cacheDinamico-v1";

const urlsToCache = [
  "/TaskManager/index.html",
  "/TaskManager/favicon.ico",
  "/TaskManager/pages/new-task.html",
  "/TaskManager/pages/edit-task.html",
  "/TaskManager/js/util/util.js",
  "/TaskManager/js/app.js",
  "/TaskManager/js/config.js",
  "/TaskManager/js/db.js",
  "/TaskManager/js/edit-task.js",
  "/TaskManager/js/new-task.js",
  "/TaskManager/js/settings.js",
  "/TaskManager/manifest.json",
  "/TaskManager/sw.js",
  "https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/lumen/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/sweetalert2@11",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_ESTATICO)
      .then((cache) => cache.addAll(urlsToCache))
      .catch(console.error)
  );
});

self.addEventListener("activate", (e) => {
  const respuesta = caches.keys().then((cache) => {
    return Promise.all(
      cache.map((clave) => {
        if (clave !== CACHE_ESTATICO && clave !== CACHE_DINAMICO) {
          return caches.delete(clave);
        }
      })
    );
  });

  evento.waitUntil(respuesta);
});

self.addEventListener("fetch", (evento) => {
  const promesaCache = caches.match(evento.request).then((cache) => {
    if (cache) {
      return cache;
    }

    return fetch(evento.request).then((respuestaRed) => {
      caches.open(CACHE_DINAMICO).then((cache) => {
        cache.put(evento.request, respuestaRed.clone());
      });
      return respuestaRed.clone();
    });
  });

  evento.respondWith(promesaCache);
});

// Sincronización de tareas
self.addEventListener("sync", async (event) => {
  if (event.tag === "sync-tasks") {
    event.waitUntil(syncTasks());
  }
});

async function syncTasks() {
  const db = await openDatabase();
  const tasks = await getTasksFromIndexedDB(db);

  // Simular sincronización con el servidor
  for (const task of tasks) {
    if (task.sincronizado === "No") {
      // Simular una solicitud exitosa
      await new Promise((resolve) => setTimeout(resolve, 1000));
      task.sincronizado = "Si";
      updateTaskInIndexedDB(db, task);
    }
  }
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

function getTasksFromIndexedDB(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tasks", "readonly");
    const store = transaction.objectStore("tasks");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

function updateTaskInIndexedDB(db, task) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tasks", "readwrite");
    const store = transaction.objectStore("tasks");
    const request = store.put(task);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}
