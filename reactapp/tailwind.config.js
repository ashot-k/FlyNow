/** @type {import("tailwindcss").Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            transitionDuration: {
                750: "750ms",
                2000: "2000ms",
            },
            colors: {
                "flyNow-main": "#18191b",
                // 'flyNow-component': '#202124',
                "flyNow-component": "#18191b",
                //"flyNow-component": "#085e54",
                //0D7BBA
                "flyNow-light": "#0a5e8f",
                "flyNow-light-secondary": "#4AB5F2",
                "flyNow-secondary": "#0A8070",
                "flyNow-even-option": "#0C0C0E19",
                "flyNow-odd-option": "#292a2e",
                //#0e8b68
            },
            animation: {
                slideIn: "slideIn 0.5s ease-in-out",
                slideOut: "slideOut 0.3s ease-in-out",
                slideInDiagonal: "slideInDiagonal 0.25s ease-in-out",
                slideInFadeIn: "slideInFadeIn 0.5s ease-in-out",
                slideOutFadeOut: "slideOutFadeOut 0.75s ease-in-out",
                fadeOut: "fadeOut 0.3s ease-in-out",
                fadeIn: "fadeIn 0.3s ease-in-out",
            },
            backgroundImage: {
                "home-page-background": "url('assets/ai_background_image.png')",
            },
            fontFamily: {
                inter: ["Inter", "sans-serif"],
                andika: ["Andika", "sans-serif"],
            },
        },
    },
    plugins: [],
};
