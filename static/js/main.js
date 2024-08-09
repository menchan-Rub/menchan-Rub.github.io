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

        link.addEventListener('focus', () => {
            link.style.outline = '2px solid #ff6f61';
        });

        link.addEventListener('blur', () => {
            link.style.outline = 'none';
        });
    });

    const resizeHandler = () => {
        if (window.innerWidth < 600) {
            document.querySelector('main').style.padding = '10px';
        } else {
            document.querySelector('main').style.padding = '20px';
        }
    };

    window.addEventListener('resize', resizeHandler);
    resizeHandler();
});
