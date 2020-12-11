export default function ({ $axios, store, redirect }) {
  $axios.setHeader('Authorization', 'b0ded4a6-f1a8-45c4-aac5-7110ed437333')
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
