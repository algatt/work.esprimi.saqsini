import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getCategories({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/builder/category/`)
        .then((response) => {
          commit(
            'setItems',
            {
              which: 'categories',
              items: response.data.categories,
            },
            { root: true }
          )
          commit(
            'setItems',
            {
              which: 'subcategories',
              items: response.data.subcategories,
            },
            { root: true }
          )
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newCategory({ commit }, category) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/builder/category/', qs.stringify(category))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateCategory({ commit }, category) {
    const code = category.code
    const surveyCount = category.surveyCount
    delete category.code
    return new Promise((resolve, reject) => {
      this.$axios
        .put('/builder/category/' + code, qs.stringify(category))
        .then((response) => {
          response.data.surveyCount = surveyCount
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
          resolve()
        })
        .catch((error) => reject(error))
    })
  },
}
