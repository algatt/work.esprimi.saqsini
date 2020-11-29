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
        .post(
          '/contact/industry/',
          qs.stringify({
            name: industry.name,
            abbreviation: industry.abbr,
            sectorCode: industry.sectorCode,
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

  updateIndustry({ commit }, industry) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(
          '/contact/industry/' + industry.code,
          qs.stringify({
            name: industry.name,
            abbreviation: industry.abbr,
            sectorCode: industry.sectorCode,
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
