export default function ({ store, redirect }) {
  const x = store.getters['auth/getPermissions']
  if (!x.includes('CONTACTBOOK')) {
    return redirect('/login')
  }
}
