// filepath: c:\Users\IFTM\Desktop\Bruno\5guys-frontend\tailwind.config.js
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}", // Certifique-se de que o caminho está correto
    ],
    theme: {
        extend: {
            colors: {
                bluePrimary: "var(--blue-primary)", // Variável CSS personalizada
                orangeButton: "var(--orange-button)",
                whiteInput: "var(--white-input)",
                redCancel: "var(--red-cancel)",
                greenSuccess: "var(--green-success)",
            },
        },
    },
    plugins: [],
};