module.exports = {
    darkMode: 'class', // Включаем классический режим
    content: [
        "../Layout/*.razor",      
        "../Pages/*.razor",
        "../Pages/Razor/*.razor",
        "../wwwroot/index.html",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-conic-light': 'conic-gradient(at top left, #fcd34d, #fda4af, #fb7185)',
                'gradient-conic-dark': 'conic-gradient(at top left, #0f172a, #1e293b, #334155, #0f172a)'
            },
            animation: {
                'button-hover': 'scale 0.2s ease-in-out',
            },
            scale: {
                110: '1.1',
                95: '0.95',
            },
        },
    },
    plugins: [],
}
