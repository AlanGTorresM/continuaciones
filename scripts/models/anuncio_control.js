export function listenerScroll(){
    // Manejo del desplazamiento
    window.addEventListener('scroll', (e) => {
        e.preventDefault();
        let anuncio = document.querySelector(".anuncio");
        const scrollY = window.scrollY;
        if(anuncio) anuncio.style.transform = `translateY(${scrollY}px)`;
    });
}
export function listenerClose() {
    const anuncios = document.querySelectorAll(".anuncio");

    anuncios.forEach((anuncio) => {
        // Agregar un evento de clic al documento para cerrar este anuncio específico
        const closeListener = (e) => {
            if (!anuncio.contains(e.target)) {
                anuncio.remove();
                document.removeEventListener('click', closeListener); // Limpia el listener
            }
        };

        // Agregar el listener de cierre solo si aún no está registrado
        setTimeout(() => {
            document.addEventListener('click', closeListener);
        }, 0); // Delay para evitar que el propio clic inicial cierre el elemento
    });
}
