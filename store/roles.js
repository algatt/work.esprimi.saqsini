import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getRoles({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/contact/role/all?limit=100&offset=0&code=${rootState.selectedContactList.code}`
        )
        .then((response) => {
          commit(
            'setItems',
            { which: 'roles', items: response.data },
            { root: true }
          )
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newRole({ commit, rootState }, role) {
    role.contactbookCode = rootState.selectedContactList.code
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/contact/role/', qs.stringify(role))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateRole({ commit }, role) {
    const code = role.code
    delete role.code
    return new Promise((resolve, reject) => {
      this.$axios
        .put('/contact/role/' + code, qs.stringify(role))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteRole({ state, commit, dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/contact/role/' + code)
        .then(() => {
          resolve()
        })
        .catch((error) => reject(error))
    })
  },
}
