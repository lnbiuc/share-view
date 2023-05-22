/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        screens: {
            sm: '576px',
            md: '992px',
            lg: '1200px',
            xl: '1440px',
        },
        fontFamily: {
            sans: ['Roboto Slab', 'sans-serif'], // 无衬线字体
            serif: ['Georgia', 'serif'], // 衬线字体
            zh: ['思源宋体', 'serif'], // 中文字体
        },
        extend: {
            spacing: {
                128: '32rem',
                144: '36rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            borderWidth: {
                2: '1px',
            },
            fontSize: {
                lg: '1.125rem',
            },
        },
    },
    plugins: [],
};
