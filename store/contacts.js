import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getContacts({ commit }, { limit, offset }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/contact/all?&limit=${limit}&offset=${offset}`)
        .then((response) => {
          commit(
            'setItems',
            {
              which: 'contacts',
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

  deleteContact({ dispatch, commit }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/contact/contact/' + code)
        .then(() => {
          commit(
            'removeItemFromState',
            { which: 'contacts', code },
            { root: true }
          )
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newContact({ commit, dispatch, state }, contact) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('contact/contact/', qs.stringify(contact))
        .then((response) => {
          commit(
            'addItemToState',
            { which: 'contacts', item: response.data },
            { root: true }
          )
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateContact({ commit }, contact) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put('contact/contact/' + contact.code, qs.stringify(contact))
        .then((response) => {
          commit(
            'updateItemInState',
            { which: 'contacts', item: response.data },
            { root: true }
          )
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
