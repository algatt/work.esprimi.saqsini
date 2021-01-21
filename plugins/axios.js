export default function ({ $axios, store, redirect }) {
  $axios.setHeader('Authorization', '2c276e30-b685-493e-a660-559feae22f8d')
  $axios.setHeader('Content-Type', 'application/x-www-form-urlencoded', [
    'post',
  ])

  $axios.onError((err) => {
    if (err.response.status === 403) {
      store.dispatch('auth/cleanAfterLogout').then(() => {
        redirect({ name: 'login' })
      })
    }
  })
}
