// import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getContactLists({ commit }, { limit, offset }) {
    const data = [
      {
        code: 1,
        name: 'default',
        validFrom: '2020-10-10',
        validTo: '2020-11-12',
        contacts: 100,
      },
    ]
    commit(
      'setItems',
      {
        which: 'contactlist',
        items: data,
      },
      { root: true }
    )
    // return new Promise((resolve, reject) => {
    //   this.$axios
    //     .get(`/contact/contact/all?&limit=${limit}&offset=${offset}`)
    //     .then((response) => {
    //       commit(
    //         'setItems',
    //         {
    //           which: 'contacts',
    //           items: response.data,
    //         },
    //         { root: true }
    //       )
    //       resolve()
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    // })
  },
  //
  // deleteContact({ dispatch, commit }, code) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .delete('/contact/contact/' + code)
  //       .then(() => {
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  //
  // newContact({ commit, dispatch, state }, contact) {
  //   delete contact.code
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .post('contact/contact/', qs.stringify(contact))
  //       .then((response) => {
  //         resolve(response.data)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  //
  // updateContact({ commit }, contact) {
  //   const code = contact.code
  //   const jobCount = contact.jobCount
  //   delete contact.code
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .put('contact/contact/' + code, qs.stringify(contact))
  //       .then((response) => {
  //         response.data.jobCount = jobCount
  //         resolve(response.data)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
}
