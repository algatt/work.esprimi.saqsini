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
      let url = ''
      if (token) url = `/builder/invites?publicIdentifier=${id}&token=${token}`
      else url = `/builder/invites/kiosk?publicIdentifier=${id}`

      const axios = require('axios')
      const instance = axios.create()

      instance
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

  add({ commit }, list) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/builder/invites/`, list, {
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
}
