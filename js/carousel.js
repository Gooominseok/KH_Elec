document.addEventListener('DOMContentLoaded', () => {
    let index = 0;
    const carousel = document.querySelector('.carousel');
    const cell_Cnt = document.querySelectorAll('.cell').length;
    
    document.querySelector('.btn-next').addEventListener('click', () => {
        index = (index + 1) % cell_Cnt;
        updateCarousel();
    });
    
    document.querySelector('.btn-prev').addEventListener('click', () => {
        index = (index - 1 + cell_Cnt) % cell_Cnt;
        updateCarousel();
    });
    
    function updateCarousel() {
        const offset = index * 100;
        carousel.style.transform = `translateX(-${offset}vw)`;
    }
});