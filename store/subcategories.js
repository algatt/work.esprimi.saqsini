import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  newSubcategory({ commit, dispatch }, subcategory) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/builder/subCategory/', qs.stringify(subcategory))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateSubcategory({ commit }, subcategory) {
    const code = subcategory.code
    const surveyCount = subcategory.surveyCount
    delete subcategory.code
    return new Promise((resolve, reject) => {
      this.$axios
        .put('/builder/subCategory/' + code, qs.stringify(subcategory))
        .then((response) => {
          response.data.surveyCount = surveyCount
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteSubcategory({ state, commit, dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/builder/subCategory/' + code)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
