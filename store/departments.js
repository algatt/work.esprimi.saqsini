import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getDepartments({ commit }, companyCode) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/contact/department/byCompany?code=${companyCode}&limit=100&offset=0`
        )
        .then((response) => {
          commit(
            'setItems',
            { which: 'departments', items: response.data },
            { root: true }
          )
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getAllDepartments({ commit }, { limit, offset }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/department?limit=${limit}&offset=${offset}`)
        .then((response) => {
          commit(
            'setItems',
            { which: 'departments', items: response.data },
            { root: true }
          )
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newDepartment({ commit }, department) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          '/contact/department/',
          qs.stringify({
            name: department.name,
            abbreviation: department.abbr,
            companyCode: department.companyCode,
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

  updateDepartment({ commit }, department) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(
          '/contact/department/' + department.code,
          qs.stringify({
            name: department.name,
            abbreviation: department.abbr,
            companyCode: department.companyCode,
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

  deleteDepartment({ state, commit, dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/contact/department/' + code)
        .then(() => {
          resolve()
        })
        .catch((error) => reject(error))
    })
  },
}
