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

  resetPassword({ commit }, email) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          '/auth/tokens/resetPassword',
          qs.stringify({
            email,
            siteUrl: 'https://saqsini.herokuapp.com/reset',
          })
        )
        .then(() => {
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  setPassword({ commit }, { email, token, password }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(
          '/auth/tokens/setPassword',
          qs.stringify({
            email,
            token,
            password,
          })
        )
        .then(() => {
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  async loginWithToken({ dispatch, commit }, token) {
    commit('setAuthToken', token)
    await dispatch('getUserDetails')
    await dispatch('getUserAvatar')
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
          if (response.data.byteLength === 0) {
            commit('setAuthAvatar', null)
            resolve()
          }
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })
          let avatar = {}
          const reader = new FileReader()

          reader.readAsDataURL(blob)
          reader.onloadend = function () {
            avatar = reader.result
            commit('setAuthAvatar', avatar)
            resolve(avatar)
          }
        })
        .catch((error) => reject(error))
    })
  },

  updateUserDetails({ dispatch }, { displayName, email }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(
          'auth/user/',
          qs.stringify({
            name: displayName,
            email,
          })
        )
        .then(() => {
          dispatch('getUserDetails')
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  updateUserAvatar({ dispatch }, avatar) {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append('avatar', avatar)
      this.$axios
        .patch('auth/user/setAvatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(() => {
          dispatch('getUserAvatar')
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  clearAvatar({ dispatch }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch('auth/user/clearAvatar')
        .then(() => {
          dispatch('getUserAvatar')
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  logout({ dispatch }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('auth/auth/logout')
        .then(() => {
          dispatch('cleanAfterLogout')
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  cleanAfterLogout({ commit }) {
    commit('setAuthToken', null)
    commit('setAuthAvatar', null)
    commit('setAuthUser', null)
    cookies.remove('x-access-token')
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
