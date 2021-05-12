import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getRoles({ commit, rootState }, { limit = 100, offset = 0 }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/contact/role/all?limit=${limit}&offset=${offset}&code=${rootState.selectedContactList.code}`
        )
        .then((response) => {
          commit('setRoles', response.data)
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
          commit('addRole', response.data)
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
          commit('updateRole', response.data)
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
          commit('deleteRole', code)
          resolve()
        })
        .catch((error) => reject(error))
    })
  },
}

export const mutations = {
  setRoles(state, roles) {
    state.items = roles
  },

  addRole(state, role) {
    state.items.push(role)
  },

  updateRole(state, role) {
    const found = state.items.find((el) => {
      return el.code === role.code
    })
    Object.assign(found, role)
  },

  deleteRole(state, code) {
    state.items = state.items.filter((el) => {
      return el.code !== code
    })
  },
}
