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
        .post(
          '/contact/sector/',
          qs.stringify({ name: sector.name, abbreviation: sector.abbr })
        )
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateSector({ commit }, sector) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(
          '/contact/sector/' + sector.code,
          qs.stringify({
            name: sector.name,
            abbreviation: sector.abbr,
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
