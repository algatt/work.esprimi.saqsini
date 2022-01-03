module.exports = {
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled', 'even'],
      borderColor: ['active', 'disabled'],
      borderWidth: ['active', 'hover'],
      height: ['hover'],
      textColor: ['disabled', 'active'],
      cursor: ['disabled'],
      animation: ['hover'],
      grayscale: ['hover'],
    },
  },
  theme: {
    extend: {
      screens: { print: { raw: 'print' } },
      colors: {
        primary: {
          light: 'var(--primary-light)',
          lighter: 'var(--primary-lighter)',
          DEFAULT: 'var(--primary)',
          darker: 'var(--primary-darker)',
          dark: 'var(--primary-dark)',
        },
      },
    },
  },
  purge: {
    content: [`assets/settings/**/*.js`],
    options: {
      safelist: [/red/, /blue/, /gray/, /yellow/, /green/, /indigo/, /pink/],
    },
  },
}
