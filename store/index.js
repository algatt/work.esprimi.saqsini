import cookie from 'cookie'

const deleteCalls = { contacts: 'contacts/deleteContact' }

export const state = () => ({
  selectedItems: [],
  currentItemToBeEdited: null,
  loading: false,
})

export const actions = {
  async nuxtServerInit({ dispatch, commit, state }, context) {
    if (process.server) {
      const cookies = cookie.parse(context.req.headers.cookie || '')

      if (cookies['x-access-token']) {
        try {
          context.store.commit('auth/setAuthToken', cookies['x-access-token'], {
            root: true,
          })

          const user = await context.app.$axios.get(
            process.env.api_path + process.env.api_auth + 'user'
          )
          commit('auth/setAuthUser', user.data)
        } catch (e) {
          await context.store.commit('auth/setAuthToken', null, { root: true })
        }
      }
    }
  },
  selectedItemsManage({ state, commit }, item) {
    let items = JSON.parse(JSON.stringify(state.selectedItems))

    const findItem = items.find((x) => {
      return x.code === item.code
    })

    if (findItem)
      items = items.filter((x) => {
        return x.code !== item.code
      })
    else items.push(item)
    commit('setSelectedItems', items)
  },
  emptySelectedItems({ commit }) {
    commit('emptySelectedItems')
  },
  deleteSelectedItems({ dispatch, state, commit }, which) {
    commit('setLoading', true)
    return new Promise((resolve, reject) => {
      const codesToDelete = state.selectedItems.map((item) => {
        return item.code
      })

      deleteMultipleByCode()
        .then(() => {
          commit('setSelectedItems', [])
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
        .finally(() => {
          commit('setLoading', false)
        })

      async function deleteMultipleByCode() {
        for (let index = 0; index < codesToDelete.length; index++) {
          const code = codesToDelete[index]
          await dispatch(deleteCalls[which], code)
        }
      }
    })
  },
  addItemToState({ commit }, { which, item }) {
    commit('addItemToState', { which, item })
  },
  updateItemInState({ commit }, { which, item }) {
    commit('updateItemInState', { which, item })
  },

  removeItemFromState({ commit }, { which, code }) {
    commit('removeItemFromState', { which, code })
  },

  setLoading({ commit }, value) {
    commit('setLoading', value)
  },

  setCurrentItemToBeEdited({ commit }, item) {
    commit('setCurrentItemToBeEdited', item)
  },
}

export const mutations = {
  setLoading(state, value) {
    state.loading = value
  },

  setCurrentItemToBeEdited(state, item) {
    state.currentItemToBeEdited = item
  },

  setItems(rootState, { which, items }) {
    rootState[which].items = items
  },

  addItemToState(rootState, { which, item }) {
    rootState[which].items.push(item)
  },

  updateItemInState(rootState, { which, item }) {
    const itemToUpdate = rootState[which].items.find((el) => {
      return el.code === item.code
    })
    Object.assign(itemToUpdate, item)
  },

  setSelectedItems(state, items) {
    state.selectedItems = JSON.parse(JSON.stringify(items))
  },

  emptySelectedItems(state) {
    state.selectedItems = []
  },

  removeItemFromState(rootState, { which, code }) {
    rootState[which].items = rootState[which].items.filter((x) => {
      return x.code !== code
    })
  },
}

export const getters = {
  getItems: (rootState) => (which) => {
    return rootState[which].items
  },
}
