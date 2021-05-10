export const state = () => ({
  items: [],
})

export const actions = {
  getQuestionsBySurvey({ state, commit }, { limit = 100, offset = 0, code }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/builder/question/all?limit=${limit}&offset=${offset}&surveyCode=${code}`
        )
        .then((response) => {
          commit('setQuestions', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  setQuestions({ commit }, questions) {
    commit('setQuestions', questions)
  },

  newQuestion({ dispatch, commit, state }, question) {
    delete question.code

    const questions = JSON.parse(JSON.stringify(state.items))
    const newPositions = questions.map((el) => {
      return { question: el.code, position: el.ordinalPosition }
    })
    newPositions.forEach((el) => {
      if (el.position >= question.ordinalPosition) {
        el.position++
      }
    })

    return new Promise((resolve, reject) => {
      this.$axios
        .post('/builder/question/', question, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(async (response) => {
          commit('addQuestion', response.data)
          await dispatch('updateQuestionNumbers', newPositions)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateQuestion({ state, commit, dispatch }, question) {
    const previousQuestionNumber = state.items.find((el) => {
      return el.code === question.code
    }).questionNumber

    const questionsToUpdate = []

    if (String(previousQuestionNumber) !== String(question.questionNumber)) {
      const tempQuestions = JSON.parse(JSON.stringify(state.items))
      tempQuestions.forEach((el) => {
        let found = false
        const branching = JSON.parse(el.surveyOptions)

        if (branching.branching.rules) {
          branching.branching.rules.forEach((rule) => {
            rule.ruleList.forEach((item) => {
              if (
                item.questionNumber &&
                String(item.questionNumber) === String(previousQuestionNumber)
              ) {
                item.questionNumber = question.questionNumber
                found = true
              }
            })
          })
        }
        if (found) {
          el.surveyOptions = JSON.stringify(branching)
          questionsToUpdate.push(el)
        }
      })
    }

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
          commit('updateQuestion', response.data)
        })
        .then((questionResponse) => {
          if (questionsToUpdate.length > 0) {
            const promises = []

            questionsToUpdate.forEach((el) => {
              promises.push(
                this.$axios
                  .put(`/builder/question/${el.code}`, el, {
                    headers: { 'Content-Type': 'application/json' },
                  })
                  .then((response) => {
                    commit('updateQuestion', response.data)
                  })
              )
            })

            Promise.all(promises).then(() => {
              resolve(questionResponse.data)
            })
          } else resolve(questionResponse.data)
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
          commit('deleteQuestion', code)
          const questions = JSON.parse(JSON.stringify(state.items))
          const newPositions = questions.map((el) => {
            return { question: el.code, position: el.ordinalPosition }
          })
          let position = 1
          newPositions.forEach((el) => {
            el.position = position
            el.questioNumber = position++
          })
          await dispatch('updateQuestionNumbers', newPositions)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateQuestionNumbers({ commit }, list) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch('/builder/question/questionSequences', list, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          commit('updateQuestionNumbers', list)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
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

  updateQuestionNumbers(state, list) {
    state.items.forEach((el) => {
      const newNumber = list.find((el2) => {
        return el2.question === el.code
      })

      if (newNumber) {
        el.ordinalPosition = newNumber.position
      }
    })
  },
}

export const getters = {
  sortedQuestions: (state) => {
    const x = JSON.parse(JSON.stringify(state.items))
    return x.sort((a, b) => {
      return a.ordinalPosition > b.ordinalPosition ? 1 : -1
    })
  },
}
