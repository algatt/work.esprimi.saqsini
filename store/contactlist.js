import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getContactLists(
    { commit, rootState, dispatch },
    { limit = 100, offset = 0 }
  ) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/contactbook/all?limit=${limit}&offset=${offset}`)
        .then((response) => {
          commit('setContactList', response.data)
          if (!rootState.selectedContactList)
            dispatch('setContactList', response.data[0], {
              root: true,
            })
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteContactList({ dispatch, commit, rootState }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/contact/contactbook/' + code)
        .then(() => {
          if (
            rootState.selectedContactList &&
            rootState.selectedContactList.code === code
          ) {
            dispatch('setContactList', null, { root: true })
          }
          commit('deleteContactList', code)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newContactList({ commit, dispatch, state }, contactList) {
    const data = new FormData()
    data.append('name', contactList.name)
    if (contactList.dataFile) data.append('data', contactList.dataFile)
    if (contactList.deleteBy) data.append('deleteBy', contactList.deleteBy)

    return new Promise((resolve, reject) => {
      this.$axios
        .post('contact/contactbook/', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          commit('addContactList', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateContactList({ commit, dispatch, state }, contactList) {
    const data = new FormData()
    data.append('name', contactList.name)
    if (contactList.data) data.append('data', contactList.data)
    if (contactList.deleteBy) data.append('deleteBy', contactList.deleteBy)

    return new Promise((resolve, reject) => {
      this.$axios
        .put(`contact/contactbook/${contactList.code}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          commit('updateContactList', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getExportData({ dispatch }, contactList) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/contactbook/exportFile?code=${contactList.code}`, {
          responseType: 'blob',
        })
        .then((response) => {
          // resolve(response.data)
          const fileName = response.headers['content-disposition'].replace(
            'attachment; filename=',
            ''
          )

          const fileDownload = require('js-file-download')
          return fileDownload(response.data, fileName)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  downloadTemplate() {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/contact/contactbook/importTemplate', { responseType: 'blob' })
        .then((response) => {
          // resolve(response.data)
          const fileName = response.headers['content-disposition'].replace(
            'attachment; filename=',
            ''
          )

          const fileDownload = require('js-file-download')
          return fileDownload(response.data, fileName)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  flagForRemoval({ dispatch, commit }, contactList) {
    const tempContactList = JSON.parse(JSON.stringify(contactList))
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/contact/contactbook/${tempContactList.code}/flagForRemoval`)
        .then(() => {
          tempContactList.flags = tempContactList.flags.filter((item) => {
            return item !== 'ACTIVE'
          })
          tempContactList.flags.push('FLAGGED_FOR_REMOVAL')
          commit(
            'updateItem',
            {
              which: 'contactlist',
              item: tempContactList,
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

  unflagForRemoval({ dispatch, commit }, contactList) {
    const tempContactList = JSON.parse(JSON.stringify(contactList))
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/contact/contactbook/${tempContactList.code}/unflagForRemoval`)
        .then(() => {
          tempContactList.flags = tempContactList.flags.filter((item) => {
            return item !== 'FLAGGED_FOR_REMOVAL'
          })
          tempContactList.flags.push('ACTIVE')
          commit(
            'updateItem',
            {
              which: 'contactlist',
              item: tempContactList,
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

  exportContactBook({ commit }, contactList) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/contact/contactbook/${contactList.code}/export`)
        .then((response) => {
          commit(
            'updateItem',
            {
              which: 'contactlist',
              item: response.data,
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

  addCollaborator({ dispatch }, { code, email }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/auth/group/${code}/addCollaborator`, qs.stringify({ email }))
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  removeCollaborator({ dispatch }, { code, email }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(
          `/auth/group/${code}/removeCollaborator`,
          qs.stringify({ email })
        )
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getCollaborators({ dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`auth/group?gCode=${code}`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  anonymiseResponses({ dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/builder/invites/anonimiseByExternalEntityCode/${code}`, null, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
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
  setContactList(state, contactList) {
    state.items = contactList
  },

  addContactList(state, contactList) {
    state.items.push(contactList)
  },

  deleteContactList(state, code) {
    state.items = state.items.filter((el) => {
      return el.code !== code
    })
  },

  updateContactList(state, contactList) {
    const foundList = state.items.find((el) => {
      return el.code === contactList.code
    })
    Object.assign(foundList, contactList)
  },
}
