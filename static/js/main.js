document.addEventListener('DOMContentLoaded', () => {
    const themeLinks = document.querySelectorAll('ul li a');

    themeLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.color = '#ff6f61';
        });

        link.addEventListener('mouseleave', () => {
            link.style.color = '#e53935';
        });

        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetUrl = link.getAttribute('href');
            document.body.style.transition = 'opacity 0.5s';
            document.body.style.opacity = '0';
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 500);
        });
    });
});
