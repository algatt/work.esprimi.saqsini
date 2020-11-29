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

    const code = company.code
    delete company.code
    return new Promise((resolve, reject) => {
      this.$axios
        .put('contact/company/' + code, data)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
