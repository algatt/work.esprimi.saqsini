import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getSectors() {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/sector/`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newSector({ commit }, sector) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/contact/sector/', qs.stringify(sector))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateSector({ commit }, sector) {
    const code = sector.code
    const companyCount = sector.companyCount
    delete sector.code
    return new Promise((resolve, reject) => {
      this.$axios
        .put('/contact/sector/' + code, qs.stringify(sector))
        .then((response) => {
          response.data.companyCount = companyCount
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteSector({ state, commit, dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/contact/sector/' + code)
        .then(() => {
          resolve()
        })
        .catch((error) => reject(error))
    })
  },
}
