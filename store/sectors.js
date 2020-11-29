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
}
