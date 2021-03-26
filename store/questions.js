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
          resolve(response.data)
        })

        .catch((error) => {
          reject(error)
        })
    })
  },

  newQuestion({ dispatch, commit, state }, question) {
    delete question.code

    console.log(question)

    const questions = JSON.parse(JSON.stringify(state.items))
    const newPositions = questions.map((el) => {
      return { question: el.code, position: el.ordinalPosition }
    })
    newPositions.forEach((el) => {
      if (el.position >= question.ordinalPosition) {
        el.position++
        el.questionNumber++
      }
    })

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
        .then(async (response) => {
          await dispatch('updateQuestionList', newPositions)
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
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteQuestion({ dispatch, commit, state }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/builder/question/' + code)
        .then(async (response) => {
          commit('deleteItem', { which: 'questions', code }, { root: true })
          const questions = JSON.parse(JSON.stringify(state.items))
          const newPositions = questions.map((el) => {
            return { question: el.code, position: el.ordinalPosition }
          })
          let position = 1
          newPositions.forEach((el) => {
            el.position = position
            el.questioNumber = position++
          })
          await dispatch('updateQuestionList', newPositions)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateQuestionList({ commit }, list) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch('/builder/question/questionSequences', list, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          commit('updateLocalList', list)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
}

export const mutations = {
  updateLocalList(state, list) {
    state.items.forEach((el) => {
      const newNumber = list.find((el2) => {
        return el2.question === el.code
      })

      if (newNumber) {
        el.ordinalPosition = newNumber.position
        el.questionNumber = newNumber.position
      }
    })
  },
}
