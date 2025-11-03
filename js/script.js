// Early theme setup to prevent white flash
(function() {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  // Load navbar
  fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;

      // === AKTIFKAN NAVBAR SESUAI HALAMAN ===
      const currentPage = window.location.pathname.split("/").pop(); 
      const navLinks = document.querySelectorAll("#navbar a");

      navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage || (currentPage === "" && href === "index.html")) {
          link.classList.add("active-nav"); // CSS khusus biar nyala
        }
      });

      // === THEME TOGGLE ===
      const themeToggle = document.getElementById("themeToggle");
      if (themeToggle) {
        const themeIcon = themeToggle.querySelector("i");

        // Ambil preferensi tema
        const savedTheme = localStorage.getItem("theme") ||
          (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

        // Set tema awal
        if (savedTheme === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
          themeIcon.className = "fas fa-sun";
        }

        // Klik toggle
        themeToggle.addEventListener("click", () => {
          const overlay = document.createElement("div");
          overlay.className = "theme-transition";
          document.body.appendChild(overlay);
          overlay.addEventListener("animationend", () => overlay.remove());

          const currentTheme = document.documentElement.getAttribute("data-theme");
          if (currentTheme === "dark") {
            document.documentElement.removeAttribute("data-theme");
            themeIcon.className = "fas fa-moon";
            localStorage.setItem("theme", "light");
          } else {
            document.documentElement.setAttribute("data-theme", "dark");
            themeIcon.className = "fas fa-sun";
            localStorage.setItem("theme", "dark");
          }
        });
      }
    })
    .catch(err => console.log("Gagal load navbar:", err));
});
