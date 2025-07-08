// filepath: c:\Users\IFTM\Desktop\Bruno\5guys-frontend\tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // Certifique-se de que o caminho está correto
    ],
    theme: {
        extend: {
            colors: {
                "blue-primary": "var(--blue-primary)",
                "orange-button": "var(--orange-button)", 
                "white-input": "var(--white-input)",
                "red-cancel": "var(--red-cancel)",
                "green-success": "var(--green-success)",
            },
        },
    },
    plugins: [],
};