export default function ({ store, redirect, route }) {
  if (
    !['login', 'activate', 'reset'].includes(route.name) &&
    !store.state.auth.authToken
  ) {
    return redirect('/login')
  }
}
