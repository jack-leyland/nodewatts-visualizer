
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {
        fontFamily: {
          'ubuntu': ['"Ubuntu"', 'sans-serif'],
          'albert': ['"Albert Sans"', 'sans-serif'],
          'Roboto': ['"Roboto"', 'sans-serif'],
  
        },
      },
    },
    plugins: [],
  }