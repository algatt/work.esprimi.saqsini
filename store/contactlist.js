// import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getContactLists({ commit, rootState, dispatch }, { limit, offset }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/contactbook/all?limit=${limit}&offset=${offset}`)
        .then((response) => {
          commit(
            'setItems',
            {
              which: 'contactlist',
              items: response.data,
            },
            { root: true }
          )
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
          if (rootState.selectedContactList.code === code) {
            dispatch('setContactList', null, { root: true })
          }
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
    if (contactList.data) data.append('data', contactList.data)
    if (contactList.deleteBy) data.append('deleteBy', contactList.deleteBy)
    if (contactList.dataFile) data.append('dataFile', contactList.dataFile)

    return new Promise((resolve, reject) => {
      this.$axios
        .post('contact/contactbook/', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
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
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  downloadTemplate() {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/contact/contactbook/importTemplate')
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  flagForRemoval({ dispatch, commit }, contactList) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/contact/contactbook/${contactList.code}/flagForRemoval`)
        .then(() => {
          contactList.flags = contactList.flags.filter((item) => {
            return item !== 'ACTIVE'
          })
          contactList.flags.push('FLAGGED_FOR_REMOVAL')
          commit(
            'updateItem',
            {
              which: 'contactlist',
              item: contactList,
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
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/contact/contactbook/${contactList.code}/unflagForRemoval`)
        .then(() => {
          contactList.flags = contactList.flags.filter((item) => {
            return item !== 'FLAGGED_FOR_REMOVAL'
          })
          contactList.flags.push('ACTIVE')
          commit(
            'updateItem',
            {
              which: 'contactlist',
              item: contactList,
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
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
