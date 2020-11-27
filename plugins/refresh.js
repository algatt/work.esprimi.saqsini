export default function ({ store }) {
  if (store.state.auth.authToken) {
    store
      .dispatch('auth/loginWithToken', store.state.auth.authToken, {
        root: true,
      })
      .then(() => {})
  }
}
