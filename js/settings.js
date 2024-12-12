document.addEventListener("DOMContentLoaded", () => {
  const settingsForm = document.getElementById("settingsForm");
  const themeSelect = document.getElementById("themeSelect");

  // Cargar configuraciones guardadas
  const savedSettings = JSON.parse(localStorage.getItem("appSettings")) || {};
  themeSelect.value = savedSettings.theme || "light";

  // Guardar configuraciones al enviar el formulario
  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newSettings = {
      theme: themeSelect.value,
    };

    localStorage.setItem("appSettings", JSON.stringify(newSettings));

    Swal.fire({
      icon: "success",
      title: "¡Guardado!",
      text: "La configuración se ha guardado correctamente.",
    });
  });

  // Aplicar el tema seleccionado
  themeSelect.addEventListener("change", () => {
    document.body.setAttribute("data-theme", themeSelect.value);

    document
      .getElementsByTagName("nav")[0]
      .classList.add(
        themeSelect.value === "dark" ? "navbar-dark" : "navbar-light"
      );

    document
      .getElementsByTagName("nav")[0]
      .classList.add(themeSelect.value === "dark" ? "bg-dark" : "bg-light");
  });

  // Aplicar el tema al cargar la página
  if (savedSettings.theme) {
    document.body.setAttribute("data-theme", savedSettings.theme);
    document
      .getElementsByTagName("nav")[0]
      .classList.add(
        savedSettings.theme === "dark" ? "navbar-dark" : "navbar-light"
      );

    document
      .getElementsByTagName("nav")[0]
      .classList.add(savedSettings.theme === "dark" ? "bg-dark" : "bg-light");
  }
});
