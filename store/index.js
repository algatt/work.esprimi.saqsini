import cookie from 'cookie'
import cookies from 'js-cookie'

export const state = () => ({
  selectedContactList: null,
})

export const actions = {
  async nuxtServerInit({ dispatch, commit, state }, context) {
    if (process.server) {
      const cookies = cookie.parse(context.req.headers.cookie || '')

      if (cookies['x-access-token']) {
        try {
          await context.store.commit(
            'auth/setAuthToken',
            cookies['x-access-token']
          )
          await context.store.dispatch('auth/getUserDetails')
        } catch {
          context.store.commit('auth/setAuthToken', '')
          context.store.commit('auth/setAuthUser', {})
        }
      }
    }
  },

  setContactList({ dispatch, commit }, item) {
    // TODO
    commit('setContactList', item)
    dispatch('contacts/getContacts', {}, { root: true })
    dispatch('departments/getAllDepartments', {}, { root: true })
    dispatch('industries/getIndustries', {}, { root: true })
    dispatch('jobs/getAllJobs', {}, { root: true })
    dispatch('roles/getRoles', {}, { root: true })
    dispatch('sectors/getSectors', {}, { root: true })
    dispatch('companies/getCompanies', {}, { root: true })
  },

  setCurrentItemToBeEdited({ commit }, item) {
    commit('setCurrentItemToBeEdited', item)
  },

  // selectedItemsManage({ state, commit }, item) {
  //   let items = JSON.parse(JSON.stringify(state.selectedItems))
  //
  //   const findItem = items.find((x) => {
  //     return x.code === item.code
  //   })
  //
  //   if (findItem)
  //     items = items.filter((x) => {
  //       return x.code !== item.code
  //     })
  //   else items.push(item)
  //   commit('setSelectedItems', items)
  // },
  //
  // selectedItemsManageAll({ state, commit }, items) {
  //   const temp = JSON.parse(JSON.stringify(items))
  //   commit('setSelectedItems', temp)
  // },
  //
  // emptySelectedItems({ commit }) {
  //   commit('emptySelectedItems')
  // },
  // deleteSelectedItems({ dispatch, state, commit }, which) {
  //   return new Promise((resolve, reject) => {
  //     const codesToDelete = state.selectedItems.map((item) => {
  //       return item.code
  //     })
  //
  //     deleteMultipleByCode()
  //       .then(() => {
  //         commit('setSelectedItems', [])
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //
  //     async function deleteMultipleByCode() {
  //       for (let index = 0; index < codesToDelete.length; index++) {
  //         const code = codesToDelete[index]
  //         await dispatch(deleteCalls[which], code)
  //         commit('deleteItem', { which, code })
  //       }
  //     }
  //   })
  // },
  //
  // newItem({ commit, dispatch }, { which, item }) {
  //   dispatch(newCalls[which], item).then((response) => {
  //     commit('newItem', { which, item: response })
  //   })
  // },
  // updateItem({ commit, dispatch }, { which, item }) {
  //   dispatch(updateCalls[which], item).then((response) => {
  //     commit('updateItem', { which, item: response })
  //   })
  // },
  // deleteItem({ commit, dispatch }, { which, code }) {
  //   dispatch(deleteCalls[which], code).then(() => {
  //     commit('deleteItem', { which, code })
  //   })
  // },

  // setLoading({ commit }, value) {
  //   commit('setLoading', value)
  // },
}

export const mutations = {
  setContactList(state, item) {
    state.selectedContactList = item
    cookies.set('selectedContactList', item, {
      expires: 7,
      sameSite: 'None',
      secure: true,
    })
  },

  // setCurrentItemToBeEdited(state, item) {
  //   state.currentItemToBeEdited = JSON.parse(JSON.stringify(item))
  // },
  //
  // setSelectedItems(state, items) {
  //   state.selectedItems = JSON.parse(JSON.stringify(items))
  // },
  //
  // emptySelectedItems(state) {
  //   state.selectedItems = []
  // },
  //
  // newItem(rootState, { which, item }) {
  //   rootState[which].items.push(item)
  // },
  //
  // updateItem(rootState, { which, item }) {
  //   const itemToUpdate = rootState[which].items.find((el) => {
  //     return el.code === item.code
  //   })
  //   Object.assign(itemToUpdate, item)
  // },
  //
  // deleteItem(rootState, { which, code }) {
  //   rootState[which].items = rootState[which].items.filter((x) => {
  //     return String(x.code) !== String(code)
  //   })
  // },
  //
  // setLoading(state, value) {
  //   state.loading = value
  // },
  //
  // setItems(rootState, { which, items }) {
  //   rootState[which].items = items
  // },
}

export const getters = {
  // getItems: (rootState) => (which) => {
  //   return rootState[which].items
  // },
  //
  // getSortedItems: (rootState) => (which) => {
  //   const x = JSON.parse(JSON.stringify(rootState[which].items))
  //   return x.sort((a, b) => {
  //     return a > b ? -1 : 1
  //   })
  // },

  getSelectedContactList: (rootState) => {
    if (rootState.selectedContactList) return rootState.selectedContactList
    else if (rootState.contactlist.items.length !== 0)
      return rootState.contactlist[0]
    return null
  },
}
