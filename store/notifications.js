import qs from 'qs'

export const state = () => ({
  items: [],
  notificationStats: {},
})

export const actions = {
  getNotifications({ commit }, { limit = 100, offset = 0 }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/auth/notifications/all?limit=${limit}&offset=${offset}`)
        .then((response) => {
          response.data.forEach((el) => {
            el.code = el.id
          })
          commit('setNotifications', response.data)
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  readNotification({ commit, state, rootState }, notification) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(
          '/auth/notifications/' + notification.code,
          qs.stringify({ email: rootState.auth.authUser.email })
        )
        .then((response) => {
          const newNotification = JSON.parse(JSON.stringify(notification))
          newNotification.flags.push('READ')
          commit('updateNotification', newNotification)
          resolve(newNotification)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteNotification({ commit }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$delete('/auth/notifications/' + code)
        .then(() => {
          commit('deleteNotification', code)
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  getInboxStats({ rootState, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/auth/notifications/inboxStats')
        .then((response) => {
          commit('setInboxStats', response.data)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  markAllAsRead({ rootState }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(
          '/auth/notifications/readAll',
          qs.stringify({ email: rootState.auth.authUser.email })
        )
        .then((response) => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export const mutations = {
  setInboxStats(state, data) {
    state.notificationStats = data
  },

  setNotifications(state, notifications) {
    state.items = notifications
  },

  updateNotification(state, notification) {
    const found = state.items.find((el) => {
      return el.code === notification.code
    })
    Object.assign(found, notification)
  },

  deleteNotification(state, code) {
    state.items = state.items.filter((el) => {
      return el.code !== code
    })
  },
}

export const getters = {
  sortedNotifications: (state) => {
    const temp = JSON.parse(JSON.stringify(state.items))
    return temp.sort((a, b) => {
      return a.createdTimestamp > b.createdTimestamp ? 1 : -1
    })
  },
}
