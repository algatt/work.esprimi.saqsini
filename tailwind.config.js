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
      safelist: ['bg-blue-500', 'bg-blue-400', 'bg-blue-600', 'bg-blue-700'],
    },
  },
}
