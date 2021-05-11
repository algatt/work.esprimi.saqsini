export const state = () => ({
  items: [],
  filters: [],
})

export const actions = {
  getAll({ commit }, { code }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/builder/invites/all?code=${code}`)
        .then((response) => {
          commit('setInvitations', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  delete({ commit }, token) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete(`/builder/invites/${token}`)
        .then((response) => {
          commit('deleteInvite', token)
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
          commit('setFilters', response.data)
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
        .put(`builder/responses/submit`, answers, {
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

  anonymiseResponses({ commit }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/builder/invites/anonimiseBySurveyCode/${code}`)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  anonymiseResponsesByEmail({ commit }, email) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/builder/invites/anonimiseByEmail/${email}`, null, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export const mutations = {
  setFilters(state, filters) {
    state.filters = filters
  },

  setInvitations(state, invitations) {
    state.items = invitations
  },

  deleteInvite(state, token) {
    state.items = state.items.filter((el) => {
      return el.token !== token
    })
  },
}
