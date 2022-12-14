export default function ({ $axios, store, redirect, route, $config }) {
  $axios.setHeader('Authorization', $config.authorization)
  $axios.setHeader('Content-Type', 'application/x-www-form-urlencoded', [
    'post',
  ])

  if (route.name !== 'survey')
    $axios.setHeader('token', store.state.auth.authToken)

  $axios.onError((err) => {
    if (err.response && err.response.status === 403) {
      store.dispatch('auth/cleanAfterLogout').then(() => {
        redirect({ name: 'login' })
      })
    }
  })
}
