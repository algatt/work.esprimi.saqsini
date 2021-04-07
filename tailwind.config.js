module.exports = {
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
      borderColor: ['active'],
    },
  },
  theme: {
    extend: {
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
      safelist: [/bg-red/, /bg-blue/, /bg-gray/],
    },
  },
}
