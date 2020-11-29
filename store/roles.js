import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getRoles({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/role?limit=100&offset=0`)
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

  newRole({ commit }, role) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          '/contact/role/',
          qs.stringify({
            name: role.name,
            abbreviation: role.abbr,
          })
        )
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateRole({ commit }, role) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(
          '/contact/role/' + role.code,
          qs.stringify({
            name: role.name,
            abbreviation: role.abbr,
          })
        )
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
