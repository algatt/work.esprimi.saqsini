export default function ({ $axios, store, redirect }) {
  $axios.setHeader('Authorization', '88920fdb-d8ad-4133-a0da-2580a56d7718')
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
