export default function ({ store, redirect }) {
  const x = store.getters['auth/getPermissions']
  if (!x.includes('SURVEY_BUILDER')) return redirect('/login')
}
