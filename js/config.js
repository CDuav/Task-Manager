function loadAppSettings() {
  const savedSettings = JSON.parse(localStorage.getItem("appSettings")) || {};

  document.addEventListener("DOMContentLoaded", () => {
    // Aplicar tema
    const theme = savedSettings.theme || "light";
    document.body.setAttribute("data-theme", theme);

    document
      .getElementsByTagName("nav")[0]
      .classList.add(theme === "dark" ? "navbar-dark" : "navbar-light");

    document
      .getElementsByTagName("nav")[0]
      .classList.add(theme === "dark" ? "bg-dark" : "bg-light");
  });
}

// Llamar esta función globalmente
loadAppSettings();
