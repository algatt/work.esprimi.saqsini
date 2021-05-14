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
          commit('setSectors', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newSector({ commit, rootState }, name) {
    const sector = {
      name,
      abbr: name,
      contactbookCode: rootState.selectedContactList.code,
    }

    return new Promise((resolve, reject) => {
      this.$axios
        .post('/contact/sector/', qs.stringify(sector))
        .then((response) => {
          commit('addSector', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateSector({ commit, state }, { code, name }) {
    const existingSector = state.items.find((el) => {
      return el.code === code
    })

    const sector = {
      name,
      abbr: existingSector.name,
      contactbookCode: existingSector.contactbookCode,
    }

    return new Promise((resolve, reject) => {
      this.$axios
        .put('/contact/sector/' + code, qs.stringify(sector))
        .then((response) => {
          response.data.companyCount = existingSector.companyCount
          commit('updateSector', response.data)
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
          commit('deleteSector', code)
          resolve()
        })
        .catch((error) => reject(error))
    })
  },
}

export const mutations = {
  updateSector(state, item) {
    const foundSector = state.items.find((el) => {
      return el.code === item.code
    })
    Object.assign(foundSector, item)
  },

  deleteSector(state, code) {
    state.items = state.items.filter((el) => {
      return el.code !== code
    })
  },

  addSector(state, sector) {
    state.items.push(sector)
  },

  setSectors(state, sectors) {
    state.items = sectors
  },
}
