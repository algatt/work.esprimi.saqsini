module.exports = {
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
      borderColor: ['active', 'disabled'],
      height: ['hover'],
      textColor: ['disabled'],
      cursor: ['disabled'],
      animation: ['hover'],
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
      safelist: {
        greedy: [
          '/blue/',
          '/red/',
          '/green/',
          '/primary/',
          '/yellow/',
          '/green/',
          ' /gray/',
          '/indigo/',
        ],
      },
    },
  },
}
