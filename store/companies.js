function convertImageToBlob(fileToBeProcessed) {
  let x = fileToBeProcessed
  x = x.replace('data:image/png;base64,', '')
  x = x.replace('data:image/jpeg;base64,', '')
  const byteCharacters = atob(x)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'image/png' })

  return blob
}

export const state = () => ({
  items: [],
})

export const actions = {
  getCompanies({ commit, rootState }, { limit = 100, offset = 0 }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/contact/company?&limit=${limit}&offset=${offset}&code=${rootState.selectedContactList.code}`
        )
        .then((response) => {
          commit('setCompanies', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getCompaniesByIndustry({ commit }, { limit = 100, offset = 0, code }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/contact/company/byIndustry?code=${code}&limit=${limit}&offset=${offset}`
        )
        .then((response) => {
          commit('setCompanies', response.data)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getCompaniesBySector({ commit }, { limit = 100, offset = 0, code }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/contact/company/bySector?code=${code}&limit=${limit}&offset=${offset}`
        )
        .then((response) => {
          commit('setCompanies', response.data)
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
        .delete(`/contact/company/${code}`)
        .then(() => {
          commit('deleteCompany', code)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newCompany({ commit, dispatch, state }, company) {
    const data = new FormData()
    data.append('abbr', company.abbr)
    data.append('name', company.name)
    if (company.size) data.append('size', company.size)
    if (company.logo) data.append('logo', convertImageToBlob(company.logo))
    data.append('industryCode', company.industryCode)

    return new Promise((resolve, reject) => {
      this.$axios
        .post('contact/company/', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          commit('addCompany', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateCompany({ commit }, company) {
    const data = new FormData()
    data.append('abbr', company.abbr)
    data.append('name', company.name)
    if (company.size) data.append('size', company.size)
    if (company.logo) data.append('logo', convertImageToBlob(company.logo))
    data.append('industryCode', company.industryCode)

    const departmentCount = company.departmentCount

    const code = company.code
    delete company.code
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`contact/company/${code}`, data)
        .then((response) => {
          response.data.departmentCount = departmentCount
          commit('updateCompany', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export const mutations = {
  setCompanies(state, companies) {
    state.items = companies
  },

  addCompany(state, company) {
    state.items.push(company)
  },

  updateCompany(state, company) {
    const foundCompany = state.items.find((el) => {
      return el.code === company.code
    })
    Object.assign(foundCompany, company)
  },

  deleteCompany(state, code) {
    state.items = state.items.filter((el) => {
      return el.code !== code
    })
  },
}
