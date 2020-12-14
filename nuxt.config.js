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
          'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Nunito+Sans:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&display=swap',
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
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

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
      target: 'https://com-lobeslab-sdc-api-test.herokuapp.com/',
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

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}
