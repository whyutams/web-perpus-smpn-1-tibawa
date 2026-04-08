/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0E1C67',
                primary2: "#334eb8",
                accent: '#2C4EEE',
                surface: '#EBF0F9',
            },
            fontFamily: {
                rubik: ['Rubik', 'sans-serif'],
            },
            maxWidth: {
                'mobile': '430px',
            },
        },
    },
    plugins: [],
}