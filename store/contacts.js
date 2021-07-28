import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getContacts({ commit, rootState }, { limit = 100, offset = 0 }) {
    if (!rootState.selectedContactList) return []
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/contact/contact/all?limit=${limit}&offset=${offset}&contactbookCode=${rootState.selectedContactList.code}`
        )
        .then((response) => {
          commit('setContacts', response.data)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteContact({ dispatch, commit }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/contact/contact/' + code)
        .then(() => {
          commit('deleteContact', code)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newContact({ commit, dispatch, state, rootState }, contact) {
    contact.contactbookCode = rootState.selectedContactList?.code
    delete contact.code
    contact.additionalAttributes = JSON.stringify(contact.additionalAttributes)
    return new Promise((resolve, reject) => {
      this.$axios
        .post('contact/contact/', qs.stringify(contact))
        .then((response) => {
          commit('newContact', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateContact({ commit }, contact) {
    const code = contact.code
    const jobCount = contact.jobCount
    contact.additionalAttributes = JSON.stringify(contact.additionalAttributes)
    delete contact.code
    return new Promise((resolve, reject) => {
      this.$axios
        .put('contact/contact/' + code, qs.stringify(contact))
        .then((response) => {
          response.data.jobCount = jobCount
          commit('updateContact', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export const mutations = {
  setContacts(state, contacts) {
    state.items = contacts
  },

  newContact(state, contact) {
    state.items.push(contact)
  },

  updateContact(state, contact) {
    const found = state.items.find((el) => {
      return el.code === contact.code
    })
    Object.assign(found, contact)
  },

  deleteContact(state, code) {
    state.items = state.items.filter((el) => {
      return el.code !== code
    })
  },
}
