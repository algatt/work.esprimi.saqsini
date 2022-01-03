import qs from 'qs'
import cookies from 'js-cookie'
import { convertBinaryDataToImage } from '~/services/image-helpers'

export const state = () => ({
  authUser: null,
  authUserAvatar: null,
  authToken: null,
})

export const actions = {
  register({ commit }, { email, name }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          '/builder/tokens/registerUser',
          qs.stringify({
            email,
            displayName: name,
            siteUrl: `${this.$config.siteUrl}activate`,
          })
        )
        .then(() => {
          resolve('ok')
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  loginWithEmailAndPassword({ dispatch, commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/auth/auth/login', qs.stringify({ email, password }))
        .then((response) => {
          if (response.headers.token) {
            commit('setAuthToken', response.headers.token)
            Promise.all([
              dispatch('getUserDetails'),
              dispatch('getUserAvatar'),
            ]).then(() => {
              resolve()
            })
          }
        })
        .catch((error) => reject(error))
    })
  },

  async loginWithoutPassword({ dispatch }) {
    await dispatch('getUserDetails')
    await dispatch('getUserAvatar')
  },

  resetPassword({ commit }, email) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          '/auth/tokens/resetPassword',
          qs.stringify({
            email,
            siteUrl: `${this.$config.siteUrl}reset`,
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

  getUserDetails({ commit, rootState }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get('auth/user')
        .then((user) => {
          commit('setAuthUser', user)
          resolve(user)
        })
        .catch((error) => {
          reject(error)
        })
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
          convertBinaryDataToImage(
            response.data,
            response.headers['content-type']
          ).then((image) => {
            commit('setAuthAvatar', image)
            resolve(image)
          })
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

  resendToken({ dispatch }, { email }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          '/auth/tokens/resendToken',
          qs.stringify({
            email,
            siteUrl: process.env.siteUrlActivate,
          })
        )
        .then(() => {
          resolve('ok')
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  activateUser({ dispatch }, { email, token }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(
          '/auth/tokens/activateUser',
          qs.stringify({
            email,
            token,
          })
        )
        .then(() => {
          resolve('ok')
        })
        .catch((error) => {
          reject(error)
        })
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
    state.authToken = token
    if (token && token !== '') {
      this.$axios.setHeader('token', token)
      cookies.set('x-access-token', token, { expires: 7, secure: true })
    } else {
      cookies.remove('x-access-token')
      this.$axios.setHeader('token', null)
    }
  },

  setAuthUser(state, details) {
    state.authUser = details
  },

  setAuthAvatar(state, avatar) {
    state.authUserAvatar = avatar
  },
}

export const getters = {
  getPermissions(state) {
    const permissions = []

    if (!state.authUser || !state.authUser.appFlags) return []

    if (state.authUser.appFlags.includes('SURVEY_BUILDER'))
      permissions.push('SURVEY_BUILDER')
    if (state.authUser.appFlags.includes('CONTACTBOOK'))
      permissions.push('CONTACTBOOK')

    return permissions
  },
}
