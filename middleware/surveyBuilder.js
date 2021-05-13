export default function ({ store, redirect, context }) {
  const x = store.getters['auth/getPermissions']
  if (!x.includes('SURVEY_BUILDER')) return redirect('/login')
}
