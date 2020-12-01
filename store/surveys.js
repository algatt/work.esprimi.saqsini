// import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getSurveysAll({ state, commit }, { limit, offset }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/builder/instance/all?limit=${limit}&offset=${offset}`)
        .then((response) => {
          commit(
            'setItems',
            {
              which: 'surveys',
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

  // getSurveyByCode({ state, dispatch, commit }, code) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .get('/builder/instance?code=' + code)
  //       .then((response) => {
  //         commit(
  //           'setItems',
  //           {
  //             which: 'surveys',
  //             items: response,
  //           },
  //           { root: true }
  //         )
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  //
  // getSurveysCategory({ state, commit }, { limit, offset, code }) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .get(
  //         `/builder/instance/all?limit=${limit}&offset=${offset}&categoryCode=${code}`
  //       )
  //       .then((response) => {
  //         commit(
  //           'setItems',
  //           {
  //             which: 'surveys',
  //             items: response.data,
  //           },
  //           { root: true }
  //         )
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  //
  // getSurveysSubcategory({ state, commit }, { limit, offset, code }) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .get(
  //         `/builder/instance/all?limit=${limit}&offset=${offset}&subCategoryCode=${code}`
  //       )
  //       .then((response) => {
  //         commit(
  //           'setItems',
  //           {
  //             which: 'surveys',
  //             items: response.data,
  //           },
  //           { root: true }
  //         )
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  //
  // newSurvey({ commit, dispatch }, survey) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .post(
  //         '/builder/instance/',
  //
  //         survey,
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         // const question = {
  //         //   surveyCode: response.data.code,
  //         //   ordinalPosition: 1,
  //         //   name: 'Page 1',
  //         //   text: [{ language: response.data.defaultLanguage, text: 'Page 1' }],
  //         //   flags: ['SECTION'],
  //         // }
  //         //
  //         // dispatch('questions/newQuestion', question, { root: true })
  //         // dispatch('categories/getCategories', false, { root: true })
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  //
  // updateSurveyDetails({ commit, dispatch }, survey) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .put(
  //         '/builder/instance/' + survey.code,
  //
  //         survey,
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         resolve(response.data)
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  //
  // async changeCategory({ commit, dispatch }, { surveyCode, oldCode, newCode }) {
  //   if (oldCode !== undefined)
  //     await this.$axios.patch(
  //       '/builder/instance/' + surveyCode + '/deallocateFromCategory',
  //       qs.stringify({ subCategoryCode: oldCode })
  //     )
  //   await this.$axios.patch(
  //     '/builder/instance/' + surveyCode + '/allocateToCategory',
  //     qs.stringify({ subCategoryCode: newCode })
  //   )
  //   await this.dispatch('categories/getCategories', false, { root: true })
  // },
  //
  // flagForRemoval({ commit, dispatch }, survey) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .patch(`/builder/instance/${survey.code}/flagForRemoval`)
  //       .then(() => {
  //         survey.flags = ['FLAGGED_FOR_REMOVAL'] // TODO:  check if ffr only
  //         // commit(
  //         //   'updateItem',
  //         //   {
  //         //     which: 'surveys',
  //         //     item: survey,
  //         //   },
  //         //   { root: true }
  //         // )
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  //
  // unFlagForRemoval({ commit, dispatch }, survey) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .patch(`/builder/instance/${survey.code}/unflagForRemoval`)
  //       .then(() => {
  //         survey.flags = ['ACTIVE'] // TODO: check if active only
  //         commit(
  //           'updateItem',
  //           {
  //             which: 'surveys',
  //             item: survey,
  //           },
  //           { root: true }
  //         )
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  //
  // duplicateSurvey({ commit }, survey) {
  //   survey.name = survey.name + '_Copy_' + this.$moment().format('YYYY_MM_DD')
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .post(
  //         '/api3/instance/' + survey.code,
  //
  //         survey,
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         commit(
  //           'newItem',
  //           { which: 'surveys', item: response.data },
  //           { root: true }
  //         )
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  //
  // deleteSurvey({ commit, dispatch }, survey) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .delete('/api3/instance/' + survey.code)
  //       .then(() => {
  //         commit(
  //           'deleteItem',
  //           { which: 'surveys', code: survey.code },
  //           { root: true }
  //         )
  //         dispatch('categories/getCategories', false, { root: true }).then(
  //           () => {
  //             resolve()
  //           }
  //         )
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
  //
  // generateLanguagePack({ dispatch }, survey) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .patch('/api3/instance/' + survey.code + '/generateLanguagePack')
  //       .then(() => {
  //         resolve()
  //       })
  //       .catch((error) => reject(error))
  //   })
  // },
  //
  // downloadLanguagePack({ dispatch }, survey) {
  //   return new Promise((resolve, reject) => {
  //     this.$axios
  //       .get('/api3/instance/languagePack?code=' + survey.code, {
  //         responseType: 'arraybuffer',
  //       })
  //       .then((response) => {
  //         resolve(response.data)
  //       })
  //       .catch((error) => reject(error))
  //   })
  // },
  //
  // uploadLanguagePack({ dispatch }, { survey, file }) {
  //   return new Promise((resolve, reject) => {
  //     const data = new FormData()
  //     data.append('languagePackFile', file)
  //     this.$axios
  //       .patch('/api3/instance/' + survey.code + '/updateLanguagePack', data, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       })
  //       .then(() => {
  //         resolve()
  //       })
  //       .catch((error) => {
  //         reject(error)
  //       })
  //   })
  // },
}

// export const getters = {
//   parsedSurveyById: (state) => (id) => {
//     let x = state.items.find((item) => {
//       return item.code === id
//     })
//     x = JSON.parse(JSON.stringify(x))
//     x.options = JSON.parse(x.options)
//     return x
//   },
// }
