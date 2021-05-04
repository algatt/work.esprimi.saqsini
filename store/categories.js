import qs from 'qs'
import Vue from 'vue'

export const state = () => ({
  categories: [],
  subcategories: [],
})

export const actions = {
  getCategories({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/builder/category/`)
        .then((response) => {
          commit('setCategories', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  saveCategory({ commit }, name) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/builder/category/', qs.stringify({ name }))
        .then((response) => {
          commit('saveCategory', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  saveSubcategory({ commit }, { name, categoryCode }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/builder/subCategory/', qs.stringify({ name, categoryCode }))
        .then((response) => {
          commit('saveSubcategory', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateCategory({ commit }, { code, name }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/builder/category/${code}`, qs.stringify({ name }))
        .then((response) => {
          commit('updateCategory', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateSubcategory({ commit }, { code, name }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/builder/subCategory/${code}`, qs.stringify({ name }))
        .then((response) => {
          commit('updateSubcategory', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteCategory({ state, commit, dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/builder/category/' + code)
        .then(() => {
          commit('deleteCategory', code)
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  deleteSubcategory({ state, commit, dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/builder/subCategory/' + code)
        .then(() => {
          commit('deletesubCategory', code)
          resolve()
        })
        .catch((error) => reject(error))
    })
  },
}

export const mutations = {
  setCategories(state, data) {
    state.categories = data.categories
    state.subcategories = data.subcategories
  },

  updateCategory(state, category) {
    const foundCategory = state.categories.find((el) => {
      return el.code === category.code
    })
    Object.assign(foundCategory, category)
  },

  updateSubcategory(state, subcategory) {
    const foundSubcategory = state.subcategories.find((el) => {
      return el.code === subcategory.code
    })
    Object.assign(foundSubcategory, subcategory)
  },

  saveCategory(state, category) {
    state.categories.push(category)
  },

  saveSubcategory(state, subcategory) {
    state.subcategories.push(subcategory)
  },

  deleteCategory(state, code) {
    state.categories = state.categories.filter((el) => {
      return el.code !== code
    })
  },

  deletesubCategory(state, code) {
    state.subcategories = state.subcategories.filter((el) => {
      return el.code !== code
    })
  },
}

export const getters = {
  getCategoriesForTreeView: (state) => {
    const temp = JSON.parse(JSON.stringify(state.categories))
    for (const i in temp) {
      const category = temp[i]
      Vue.set(
        category,
        'children',
        state.subcategories.filter((el) => {
          return el.categoryCode === category.code
        })
      )
    }
    return temp
  },
}
