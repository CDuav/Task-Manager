const DB_NAME = "CapiTaskDB";
const DB_VERSION = 1;
let db;

// Inicializar IndexedDB
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve();
    };

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
    };

    request.onerror = (event) => {
      console.error("Error al abrir la base de datos:", event.target.error);
      reject(event.target.error);
    };
  });
}

// Agregar Tarea
function addTaskToDB(task) {
  task.sincronizado = navigator.onLine ? "Sí" : "No";
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tasks", "readwrite");
    const store = transaction.objectStore("tasks");
    const request = store.add(task);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Obtener todas las tareas
function getTasksFromDB() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tasks", "readonly");
    const store = transaction.objectStore("tasks");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Actualizar una tarea
async function updateTask(updatedTask) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tasks", "readwrite");
    const store = transaction.objectStore("tasks");
    const request = store.put(updatedTask);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Actualizar una tarea
async function updateTask(updatedTask) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tasks", "readwrite");
    const store = transaction.objectStore("tasks");
    const request = store.put(updatedTask);

    request.onsuccess = () => resolve(request.result);
    request.onerror = (event) => reject(event.target.error);
  });
}
// Eliminar tarea
function deleteTaskFromDB(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("tasks", "readwrite");
    const store = transaction.objectStore("tasks");
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}

// Obtener una tarea por ID
async function getTaskById(id) {
  const tasks = await getTasksFromDB();
  return tasks.find((task) => task.id === id);
}
