import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getSectors({ commit, rootState }, { limit = 100, offset = 0 }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/contact/sector/all?contactbookCode=${rootState.selectedContactList.code}&limit=${limit}&offset=${offset}`
        )
        .then((response) => {
          commit(
            'setItems',
            { which: 'sectors', items: response.data },
            { root: true }
          )
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newSector({ commit, rootState }, sector) {
    sector.contactbookCode = rootState.selectedContactList.code
    delete sector.code
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
