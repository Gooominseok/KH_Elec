document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById("mainNav");

    window.addEventListener('scroll', () => {
        if (window.scrollY <= 20) {
            navbar.classList.remove('scroll');
        } else {
            navbar.classList.add('scroll');
        }
    });

    const navToggle = document.getElementById('navToggle');
    const navLink = document.getElementById('navLink');
    const navItems = document.querySelectorAll('.nav-item');

    navToggle.addEventListener('click', () => {
        navLink.classList.toggle('show');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLink.classList.remove('show');
        });
    });
});