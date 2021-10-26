module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans-serif': ['Noto Sans', 'sans-serif'],
    },
    boxShadow: {
      inner: 'inset -5px 0 15px rgba(0,0,0,.05)',
    },
    extend: {
      strokeWidth: {
        '3': '3',
        '4': '4',
        '6': '6',
      },
    },
  },
  variants: {
    extend: {
      strokeWidth: ['hover', 'focus'],
    },
  },
  plugins: [],
};
