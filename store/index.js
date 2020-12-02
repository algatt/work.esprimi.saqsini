import cookie from 'cookie'

const deleteCalls = {
  contacts: 'contacts/deleteContact',
  companies: 'companies/deleteCompany',
  sectors: 'sectors/deleteSector',
  industries: 'industries/deleteIndustry',
  departments: 'departments/deleteDepartment',
  roles: 'roles/deleteRole',
  jobs: 'jobs/deleteJob',
  categories: 'categories/deleteCategory',
  subcategories: 'subcategories/deleteSubcategory',
}

const newCalls = {
  contacts: 'contacts/newContact',
  companies: 'companies/newCompany',
  sectors: 'sectors/newSector',
  industries: 'industries/newIndustry',
  departments: 'departments/newDepartment',
  roles: 'roles/newRole',
  jobs: 'jobs/newJob',
  categories: 'categories/newCategory',
  subcategories: 'subcategories/newSubcategory',
}

const updateCalls = {
  contacts: 'contacts/updateContact',
  companies: 'companies/updateCompany',
  sectors: 'sectors/updateSector',
  industries: 'industries/updateIndustry',
  departments: 'departments/updateDepartment',
  roles: 'roles/updateRole',
  jobs: 'jobs/updateJob',
  categories: 'categories/updateCategory',
  subcategories: 'subcategories/updateSubcategory',
}

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

  setCurrentItemToBeEdited({ commit }, item) {
    commit('setCurrentItemToBeEdited', item)
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

      async function deleteMultipleByCode() {
        for (let index = 0; index < codesToDelete.length; index++) {
          const code = codesToDelete[index]
          await dispatch(deleteCalls[which], code)
          commit('deleteItem', { which, code })
        }
      }
    })
  },

  newItem({ commit, dispatch }, { which, item }) {
    dispatch(newCalls[which], item).then((response) => {
      commit('newItem', { which, item: response })
    })
  },
  updateItem({ commit, dispatch }, { which, item }) {
    dispatch(updateCalls[which], item).then((response) => {
      commit('updateItem', { which, item: response })
    })
  },
  deleteItem({ commit, dispatch }, { which, code }) {
    dispatch(deleteCalls[which], code).then(() => {
      commit('deleteItem', { which, code })
    })
  },

  setLoading({ commit }, value) {
    commit('setLoading', value)
  },
}

export const mutations = {
  setCurrentItemToBeEdited(state, item) {
    state.currentItemToBeEdited = JSON.parse(JSON.stringify(item))
  },

  setSelectedItems(state, items) {
    state.selectedItems = JSON.parse(JSON.stringify(items))
  },

  emptySelectedItems(state) {
    state.selectedItems = []
  },

  newItem(rootState, { which, item }) {
    rootState[which].items.push(item)
  },

  updateItem(rootState, { which, item }) {
    const itemToUpdate = rootState[which].items.find((el) => {
      return el.code === item.code
    })
    Object.assign(itemToUpdate, item)
  },

  deleteItem(rootState, { which, code }) {
    rootState[which].items = rootState[which].items.filter((x) => {
      return x.code !== code
    })
  },

  setLoading(state, value) {
    state.loading = value
  },

  setItems(rootState, { which, items }) {
    rootState[which].items = items
  },
}

export const getters = {
  getItems: (rootState) => (which) => {
    return rootState[which].items
  },

  getSortedItems: (rootState) => (which) => {
    const x = JSON.parse(JSON.stringify(rootState[which].items))
    return x.sort((a, b) => {
      return a > b ? -1 : 1
    })
  },
}
