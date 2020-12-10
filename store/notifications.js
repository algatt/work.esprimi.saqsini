import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getNotifications({ commit }, { limit, offset }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/auth/notifications/all?limit=${limit}&offset=${offset}`)
        .then((response) => {
          response.data.forEach((el) => {
            el.code = el.id
          })
          commit(
            'setItems',
            {
              which: 'notifications',
              items: response.data,
            },
            { root: true }
          )
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
          resolve()
        })
        .catch((error) => reject(error))
    })
  },
}