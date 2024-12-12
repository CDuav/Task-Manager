document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = parseInt(urlParams.get("id"));

  try {
    try {
      await initDB();
    } catch (error) {
      console.error("Error al inicializar la base de datos:", error);
    }
    const task = await getTaskById(taskId);

    // Rellenar el formulario con los datos de la tarea
    document.getElementById("taskName").value = task.name;
    document.getElementById("taskDescription").value = task.description;
    document.getElementById("startDate").value = task.startDate || "";
    document.getElementById("endDate").value = task.endDate || "";

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

    if (task.image) {
      taskImageInput.setAttribute("data-image", task.image);
      const imagePreview = document.getElementById("previewImage");
      imagePreview.src = task.image;
      imagePreview.style.display = "block";
      imagePreview.style.marginInline = "auto";
    }

    const taskEditForm = document.getElementById("taskEditForm");

    taskEditForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const taskName = document.getElementById("taskName").value;
      const taskDescription = document.getElementById("taskDescription").value;
      const taskImageInput = document.getElementById("taskImage");
      const taskImage = taskImageInput && taskImageInput.files[0];
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;

      const updatedTask = {
        id: taskId,
        name: taskName,
        description: taskDescription,
        image: taskImage
          ? await readFileAsDataURL(taskImage)
          : taskImageInput.getAttribute("data-image"),
        startDate: startDate,
        endDate: endDate,
      };

      try {
        await updateTask(updatedTask);

        // Mostrar alerta con SweetAlert
        Swal.fire({
          icon: "success",
          title: "¡Tarea actualizada!",
          text: "La tarea se ha actualizado correctamente.",
          confirmButtonText: "OK",
        }).then(() => {
          // Redirigir a la página principal después de cerrar la alerta
          window.location.href = "../index.html";
        });
      } catch (error) {
        // Manejo de errores
        console.error("Error al actualizar la tarea:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar la tarea. Por favor, inténtalo nuevamente.",
        });
      }
    });
  } catch (error) {
    console.error("Error al cargar la tarea:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Error al cargar la tarea",
    });
  }
});
