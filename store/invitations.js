export const state = () => ({
  items: [],
})

export const actions = {
  getAll({ commit }, { code }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/builder/invites/all?code=${code}`)
        .then((response) => {
          commit(
            'setItems',
            {
              which: 'invitations',
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

  delete({ commit }, { code }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete(`/builder/invites/${code}`)
        .then((response) => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

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
      const axios = require('axios')
      const instance = axios.create()

      instance
        .put(`/builder/invites/`, answers, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: process.env.authorization,
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
      const axios = require('axios')
      const instance = axios.create()

      instance
        .patch(`/builder/invites/${token}/consume`, null, {
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
