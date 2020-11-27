import qs from 'qs'
import cookies from 'js-cookie'

export const state = () => ({
  authUser: null,
  authUserAvatar: null,
  authToken: null,
})

export const actions = {
  loginWithEmailAndPassword({ dispatch, commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/auth/auth/login', qs.stringify({ email, password }))
        .then((response) => {
          commit('setAuthToken', response.headers.token)
          console.log(response.headers.token)
          cookies.set('x-access-token', response.headers.token, {
            expires: 7,
            sameSite: 'None',
            secure: true,
          })
        })
        .then(async () => {
          await dispatch('getUserDetails')
          await dispatch('getUserAvatar')
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  getUserDetails({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get('auth/user')
        .then((user) => {
          commit('setAuthUser', user)
          resolve(user)
        })
        .catch((error) => reject(error))
    })
  },

  getUserAvatar({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('auth/user/avatar', {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          let avatar = {}
          const reader = new FileReader()

          reader.readAsDataURL(blob)
          reader.onloadend = function () {
            avatar = reader.result
            commit('setAuthAvatar', avatar)
          }

          resolve(avatar)
        })
        .catch((error) => reject(error))
    })
  },
}

export const mutations = {
  setAuthToken(state, token) {
    this.$axios.setHeader('token', token)
    state.authToken = token
  },

  setAuthUser(state, user) {
    state.authUser = user
  },

  setAuthAvatar(state, avatar) {
    state.authUserAvatar = avatar
  },
}
