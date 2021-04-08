export default function ({ store, redirect, route }) {
  store.commit('setSelectedItems', [])
  store.commit('setCurrentItemToBeEdited', null)
  if (
    !['login', 'activate', 'reset'].includes(route.name) &&
    !store.state.auth.authUser
  ) {
    return redirect('/login')
  }
}
