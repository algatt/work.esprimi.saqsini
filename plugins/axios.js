export default function ({ $axios, store, redirect }) {
  $axios.setHeader('Authorization', process.env.authorization)
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
