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
}
