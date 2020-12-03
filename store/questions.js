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
}
