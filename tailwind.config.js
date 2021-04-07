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
    // options: {
    //   safelist: [
    //     'bg-red-300',
    //     'bg-red-400',
    //     'bg-red-500',
    //     'bg-red-600',
    //     'bg-red-700',
    //     'bg-red-800',
    //     'bg-blue-300',
    //     'bg-blue-400',
    //     'bg-blue-500',
    //     'bg-blue-600',
    //     'bg-blue-700',
    //     'bg-blue-800',
    //     'bg-gray-300',
    //     'bg-gray-400',
    //     'bg-gray-500',
    //     'bg-gray-600',
    //     'bg-gray-700',
    //     'bg-gray-800',
    //   ],
    // },
  },
}
