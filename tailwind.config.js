module.exports = {
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled', 'even'],
      borderColor: ['active', 'disabled'],
      borderWidth: ['active', 'hover'],
      height: ['hover'],
      textColor: ['disabled'],
      cursor: ['disabled'],
      animation: ['hover'],
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
    options: {
      safelist: [/red/, /blue/, /gray/, /yellow/, /green/, /indigo/, /pink/],
    },
  },
}
