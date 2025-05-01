'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const navbarBoton = document.getElementById('navbarBoton');
    const navbarResponsive = document.getElementById('navbarResponsive');
    const menuLinks = document.querySelectorAll('.navlist-responsive a');
    const mainContent = document.querySelector('main');
    const footerContent = document.querySelector('footer');
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;

    if (!navbarBoton || !navbarResponsive) {
        console.warn("No se encontró el botón o el contenedor del menú responsive.");
        return;
    }

    function toggleResponsiveMenu() {
        navbarResponsive.classList.toggle('open');
        if (mainContent) mainContent.classList.toggle('blur');
        if (footerContent) footerContent.classList.toggle('blur');
    }

    function closeResponsiveMenu() {
        navbarResponsive.classList.remove('open');
        if (mainContent) mainContent.classList.remove('blur');
        if (footerContent) footerContent.classList.remove('blur');
    }

    // Alternar menú al hacer clic en el botón
    navbarBoton.addEventListener('click', toggleResponsiveMenu);

    // Manejar clic en enlaces del menú
    menuLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
    
            if (href.startsWith("#")) {
                event.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
    
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - navbarHeight,
                        behavior: 'smooth'
                    });
                }
            }

            // Cerrar siempre el menú
            closeResponsiveMenu();
        });
    });

    // Cerrar menú si se hace clic fuera de él
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!navbarResponsive.contains(target) && !navbarBoton.contains(target)) {
            closeResponsiveMenu();
        }
    });
});



