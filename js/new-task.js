const taskForm = document.getElementById("taskForm");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await initDB();
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }

  const taskImageInput = document.getElementById("taskImage");
  const previewImage = document.getElementById("previewImage");

  // Mostrar previsualización de la imagen al seleccionar un archivo
  taskImageInput.addEventListener("change", () => {
    const file = taskImageInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        previewImage.style.marginInline = "auto";
      };

      reader.readAsDataURL(file);
    } else {
      previewImage.style.display = "none";
    }
  });

  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const taskName = document.getElementById("taskName").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const taskImageInput = document.getElementById("taskImage");
    const taskImage = taskImageInput && taskImageInput.files[0];
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    try {
      await addTask(
        taskName,
        taskDescription,
        startDate,
        endDate,
        taskImage ? await readFileAsDataURL(taskImage) : null
      );

      taskForm.reset();

      // Mostrar alerta con SweetAlert
      Swal.fire({
        icon: "success",
        title: "¡Tarea guardada!",
        text: "La tarea se ha guardado correctamente.",
        confirmButtonText: "OK",
      }).then(() => {
        // Redirigir a la página principal después de cerrar la alerta
        window.location.href = "../index.html";
      });
    } catch (error) {
      // Manejar errores
      console.error("Error al guardar la tarea:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al guardar la tarea.",
      });
    }
  });
});

// Función para leer archivos como DataURL
async function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

// Función para añadir tareas con sincronización
async function addTask(name, description, startDate, endDate, image) {
  const task = {
    name,
    description,
    startDate,
    endDate,
    image,
    sincronizado: navigator.onLine ? "Si" : "No",
  };

  await addTaskToDB(task);

  // Registrar sincronización si está offline y el navegador lo soporta
  if (!navigator.onLine && "serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.sync.register("sync-tasks");
    });
  }
}

// Función auxiliar para guardar tareas en IndexedDB
async function addTaskToDB(task) {
  const db = await openDatabase();
  const transaction = db.transaction("tasks", "readwrite");
  const store = transaction.objectStore("tasks");
  store.add(task);
  transaction.oncomplete = () => console.log("Tarea añadida a IndexedDB");
}

// Abrir la base de datos
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CapiTaskDB", 1);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}
