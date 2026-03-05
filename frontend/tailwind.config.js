/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"DM Sans"', 'sans-serif'],
                display: ['"DM Sans"', 'sans-serif'],
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                }
            },
            animation: {
                marquee: 'marquee 50s linear infinite',
            },
            colors: {
                'gusli-bg': '#FFFDF5',
                'gusli-secondary': '#FFFFFF',
                'gusli-highlight-1': '#DFDAC6',
                'gusli-highlight-2': '#000000',
                'gusli-green': '#12271D',
            },
        },
    },
    plugins: [],
}
