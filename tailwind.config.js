module.exports = {
  variants: {
    extend: { opacity: ['disabled'], backgroundColor: ['disabled'] },
  },
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'var(--primary-light)',
          lighter: 'var(--primary-lighter)',
          de: 'var(--primary)',
          darker: 'var(--primary-darker)',
          dark: 'var(--primary-dark)',
        },
      },
    },
  },
}
