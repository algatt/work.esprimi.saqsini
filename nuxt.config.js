export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)

  head: {
    title: 'saqsini',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Quicksand:wght@400;500;600;700&display=swap',
      },
    ],
    script: [
      {
        src: 'https://kit.fontawesome.com/3027f8b056.js',
        crossorigin: 'anonymous',
      },
    ],
  },
  env: {
    api_auth: '/api/v0.3/',
    api_path: 'https://com-lobeslab-sdc-api-test.herokuapp.com',
    siteUrl: 'https://saqsini.herokuapp.com/',
    siteUrlActivate: this.siteUrl + 'activate',
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/axios.js',
    { src: '@/plugins/plugins-client.js', ssr: false },
    { src: '@/plugins/refresh.js', ssr: false },
    '@/plugins/vuetelinput.js',
    { src: '~plugins/draggable.js', ssr: false },
    { src: '~plugins/chartjs-datalabels.js', ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  tailwindcss: {
    jit: true,
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
  },

  proxy: {
    '/auth/': {
      target: 'https://com-lobeslab-sdc-api-test.herokuapp.com/',
      pathRewrite: {
        '^/auth/': '/api/v0.3/',
      },
    },
    '/contact/': {
      // target: 'https://com-lobeslab-sdc-api-test.herokuapp.com/api/v0.3/',
      target: 'https://com-lobeslab-sdc-api-test.herokuapp.com',
      pathRewrite: {
        '^/contact/': '/contactbook/v0.3/',
      },
    },
    '/builder/': {
      // target: 'https://com-lobeslab-sdc-api-test.herokuapp.com/api/v0.3/',
      target: 'https://com-lobeslab-sdc-api-test.herokuapp.com/',
      pathRewrite: {
        '^/builder/': '/surveyBuilder/v0.3/',
      },
    },
  },

  // Build Configuration (p)
  build: {
    loaders: {
      vue: {
        prettify: false,
      },
    },
  },
}
