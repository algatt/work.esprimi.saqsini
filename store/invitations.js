export const state = () => ({
  items: [],
})

export const actions = {
  getFilters({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/contact/contactbook/filters')
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
