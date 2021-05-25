export const state = () => ({
  items: [],
})

export const actions = {
  getQuestions({ state, commit }, { limit = 100, offset = 0 }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/builder/questionTemplate/all?limit=${limit}&offset=${offset}`)
        .then((response) => {
          commit('setQuestions', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  //
  // setQuestions({ commit }, questions) {
  //   commit('setQuestions', questions)
  // },
  //
  newQuestion({ dispatch, commit, state }, question) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/builder/questionTemplate/', question, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          commit('addQuestion', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateQuestion({ state, commit, dispatch }, question) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/builder/questionTemplate/${question.code}`, question, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          commit('updateQuestion', response.data)
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
        .delete('/builder/questionTemplate/' + code)
        .then((response) => {
          commit('deleteQuestion', code)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  //
  // updateQuestionNumbers({ commit }, list) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .patch('/builder/question/questionSequences', list, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       })
  //       .then((response) => {
  //         commit('updateQuestionNumbers', list)
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
}

export const mutations = {
  setQuestions(state, questions) {
    state.items = questions
  },

  addQuestion(state, question) {
    state.items.push(question)
  },

  deleteQuestion(state, code) {
    state.items = state.items.filter((el) => {
      return el.code !== code
    })
  },

  updateQuestion(state, question) {
    const foundQuestion = state.items.find((el) => {
      return el.code === question.code
    })
    Object.assign(foundQuestion, question)
  },
  //
  // updateQuestionNumbers(state, list) {
  //   state.items.forEach((el) => {
  //     const newNumber = list.find((el2) => {
  //       return el2.question === el.code
  //     })
  //
  //     if (newNumber) {
  //       el.ordinalPosition = newNumber.position
  //     }
  //   })
  // },
}

export const getters = {
  // sortedQuestions: (state) => {
  //   const x = JSON.parse(JSON.stringify(state.items))
  //   return x.sort((a, b) => {
  //     return a.ordinalPosition > b.ordinalPosition ? 1 : -1
  //   })
  // },
}
