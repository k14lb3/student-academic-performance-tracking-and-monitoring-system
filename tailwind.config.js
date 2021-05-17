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
    extend: {
      colors: {
        orange: {
          DEFAULT: '#FF9900',
          50: '#FFF5E5',
          100: '#FFEBCC',
          200: '#FFD699',
          300: '#FFC266',
          400: '#FFAD33',
          500: '#FF9900',
          600: '#CC7A00',
          700: '#995C00',
          800: '#663D00',
          900: '#331F00',
        },
        gray: {
          DEFAULT: '#363636',
          50: '#A9A9A9',
          100: '#9C9C9C',
          200: '#838383',
          300: '#696969',
          400: '#505050',
          500: '#363636',
          600: '#1C1C1C',
          700: '#030303',
          800: '#000000',
          900: '#000000',
        },
        red: {
          DEFAULT: '#F43434',
          50: '#FFFFFF',
          100: '#FEF6F6',
          200: '#FCC5C5',
          300: '#F99595',
          400: '#F76464',
          500: '#F43434',
          600: '#E80D0D',
          700: '#B80A0A',
          800: '#880707',
          900: '#570505',
        },
      },
      animation: {
        'loader-internal-circle-spin':
          'loader-internal-circle-spin 1s ease-in-out infinite',
        'loader-external-circle-spin':
          'loader-external-circle-spin 1s linear infinite',
      },
      keyframes: {
        'loader-internal-circle-spin': {
          '0%': { 'stroke-dashoffset': '187' },
          '25%': { 'stroke-dashoffset': '80' },
          '100%': { 'stroke-dashoffset': '187', transform: 'rotate(360deg)' },
        },
        'loader-external-circle-spin': {
          '0%': { 'stroke-dashoffset': '312', transform: 'rotate(70deg)' },
          '25%': { 'stroke-dashoffset': '-312' },
          '100%': { 'stroke-dashoffset': '-312', transform: 'rotate(450deg)' },
        },
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover', 'after'],
      opacity: ['disabled'],
      fontSize: ['group-hover', 'important'],
      margin: ['first', 'last', 'important'],
      padding: ['important'],
      textColor: ['after'],
      borderRadius: ['important'],
      backgroundColor: ['important'],
    },
  },
  plugins: [
    require('tailwindcss-pseudo-elements')({
      customPseudoClasses: ['foo'],
      customPseudoElements: ['bar'],
      contentUtilities: true,
      emptyContent: false,
      classNameReplacer: {},
    }),
    require('tailwindcss-important')(),
  ],
};
