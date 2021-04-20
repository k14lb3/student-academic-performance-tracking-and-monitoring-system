module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      openSans: ['Open Sans', 'sans-serif'],
      roboto: ['Roboto', 'serif'],
    },
    screens: {
      xxx: { max: '336px' },
      xs: { max: '480px' },
      xm: { max: '624px' },
      sm: { max: '768px' },
      md: { max: '1024px' },
      'r-md': { max: '1025px' },
      'ol-sm': { min: '481px', max: '768px' },
      'ol-md': { min: '769px', max: '1024px' },
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
