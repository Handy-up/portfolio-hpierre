
document.getElementById('menu-toggler').addEventListener('click', function () {
    const menu = document.getElementById('navbar-menu');
    menu.classList.toggle('active');
});


// Ajout d'un gestionnaire d'événements pour le défilement
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 0) {
        navbar.classList.remove("transparent");
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
        navbar.classList.add("transparent");
    }
});

// Initialisation de la classe au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY === 0) {
        navbar.classList.add("transparent");
    }
});
