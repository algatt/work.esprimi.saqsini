export const state = () => ({
  items: [],
})

export const actions = {
  getQuestionsBySurvey({ state, commit }, { limit, offset, code }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/builder/question/all?limit=${limit}&offset=${offset}&surveyCode=${code}`
        )
        .then((response) => {
          commit(
            'setItems',
            {
              which: 'questions',
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

  newQuestion({ commit }, question) {
    delete question.code
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          '/builder/question/',

          question,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateQuestion({ commit }, question) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(
          '/builder/question/' + question.code,

          question,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          commit(
            'updateItem',
            { which: 'questions', item: response.data },
            { root: true }
          )
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteQuestion({ commit }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/builder/question/' + code)
        .then((response) => {
          commit('deleteItem', { which: 'questions', code }, { root: true })
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}
