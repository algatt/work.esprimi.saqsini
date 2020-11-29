export default function ({ store, redirect, route }) {
  store.commit('setSelectedItems', [])
  store.commit('setCurrentItemToBeEdited', null)
  if (route.name !== 'login' && !store.state.auth.authUser) {
    return redirect('/login')
  }
  // else if (
  //   store.state.auth.authUser &&
  //   (route.name === 'index' || route.name === 'login')
  // )
  //   return redirect('/surveys')
}
