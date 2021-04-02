export const state = () => ({
  items: [],
})

export const actions = {
  getFilters({ commit, rootGetters }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/contact/contactbook/filters?code=${rootGetters.getSelectedContactList.code}`
        )
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  redeem({ commit }, { id, token }) {
    return new Promise((resolve, reject) => {
      let url = `/builder/invites?publicIdentifier=${id}`
      if (token) url = url + `&token=${token}`
      this.$axios
        .get(url, {
          headers: { Authorization: process.env.authorization },
        })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  submit({ commit }, answers) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/builder/invites/`, answers, {
          headers: {
            'Content-Type': 'application/json',
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

  consume({ commit }, token) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/builder/invites/${token}/consume`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
