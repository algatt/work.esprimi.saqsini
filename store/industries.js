import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getIndustries({ commit, rootState }) {
    if (!rootState.selectedContactList) return []
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/industry/all?code=${rootState.selectedContactList.code}`)
        .then((response) => {
          commit('setIndustries', response.data)
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
          commit('addIndustry', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateIndustry({ state, commit }, { code, name }) {
    const existingIndustry = state.items.find((el) => {
      return el.code === code
    })

    const industry = {
      name,
      abbr: existingIndustry.abbr,
      sectorCode: existingIndustry.sectorCode,
    }

    return new Promise((resolve, reject) => {
      this.$axios
        .put('/contact/industry/' + code, qs.stringify(industry))
        .then((response) => {
          response.data.companyCount = existingIndustry.companyCount
          commit('updateIndustry', response.data)
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
          commit('deleteIndustry', code)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export const mutations = {
  setIndustries(state, industries) {
    state.items = industries
  },

  updateIndustry(state, industry) {
    const foundIndustry = state.items.find((el) => {
      return el.code === industry.code
    })
    Object.assign(foundIndustry, industry)
  },

  deleteIndustry(state, code) {
    state.items = state.items.filter((el) => {
      return el.code !== code
    })
  },

  addIndustry(state, industry) {
    state.items.push(industry)
  },
}
