import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getCompanies({ commit }, { limit, offset }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/company?&limit=${limit}&offset=${offset}`)
        .then((response) => {
          commit(
            'setItems',
            {
              which: 'companies',
              items: response.data,
            },
            { root: true }
          )
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteCompany({ dispatch, commit }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/contact/company/' + code)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newCompany({ commit, dispatch, state }, contact) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('contact/company/', qs.stringify(contact))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateCompany({ commit }, contact) {
    const code = contact.code
    delete contact.code
    return new Promise((resolve, reject) => {
      this.$axios
        .put('contact/company/' + code, qs.stringify(contact))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
