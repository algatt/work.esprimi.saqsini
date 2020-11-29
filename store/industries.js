import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getIndustries() {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/industry/`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newIndustry({ commit, dispatch }, industry) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/contact/industry/', qs.stringify(industry))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateIndustry({ commit }, industry) {
    const code = industry.code
    const companyCount = industry.companyCount
    delete industry.code
    return new Promise((resolve, reject) => {
      this.$axios
        .put('/contact/industry/' + code, qs.stringify(industry))
        .then((response) => {
          response.data.companyCount = companyCount
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteIndustry({ state, commit, dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/contact/industry/' + code)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
