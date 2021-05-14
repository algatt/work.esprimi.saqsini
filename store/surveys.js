import qs from 'qs'
import { convertSurveyFromFormToApi } from '~/services/survey-helpers'

export const state = () => ({
  items: [],
})

export const actions = {
  getSurveysAll({ state, commit }, { limit = 100, offset = 0 }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/builder/instance/all?limit=${limit}&offset=${offset}`)
        .then((response) => {
          commit('setSurveys', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getSurveyByCode({ state, dispatch, commit }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/builder/instance?code=${code}`)
        .then((response) => {
          commit('setSurveys', [response.data])
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getSurveysCategory({ state, commit }, { limit = 100, offset = 0, code }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/builder/instance/all?limit=${limit}&offset=${offset}&categoryCode=${code}`
        )
        .then((response) => {
          commit('setSurveys', response.data)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getSurveysSubcategory({ state, commit }, { limit = 100, offset = 0, code }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/builder/instance/all?limit=${limit}&offset=${offset}&subCategoryCode=${code}`
        )
        .then((response) => {
          commit('setSurveys', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newSurvey({ commit, dispatch }, survey) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          '/builder/instance/',

          convertSurveyFromFormToApi(survey),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          const question = {
            surveyCode: response.data.code,
            ordinalPosition: 1,
            questionNumber: 1,
            surveyOptions: JSON.stringify({ branching: { rules: [] } }),
            name: 'Page 1',
            text: [{ language: response.data.defaultLanguage, text: 'Page 1' }],
            flags: ['SECTION'],
          }
          dispatch('questions/newQuestion', question, { root: true })
          commit('newSurvey', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateSurvey({ commit, dispatch, state }, survey) {
    const newCategoryCode = survey.categoryCode
    const newSubcategoryCode = survey.subCategoryCode

    const oldSubcategoryCode = state.items.find((el) => {
      return el.code === survey.code
    }).subCategoryCode

    return new Promise((resolve, reject) => {
      this.$axios
        .put(
          '/builder/instance/' + survey.code,

          convertSurveyFromFormToApi(survey),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then(async (response) => {
          if (oldSubcategoryCode !== newSubcategoryCode)
            await dispatch('changeCategory', {
              surveyCode: survey.code,
              oldCode: oldSubcategoryCode,
              newCode: newSubcategoryCode,
            })
          response.data.categoryCode = newCategoryCode
          response.data.subCategoryCode = newSubcategoryCode
          commit('updateSurvey', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  async changeCategory({ commit, dispatch }, { surveyCode, oldCode, newCode }) {
    if (oldCode !== undefined)
      await this.$axios.patch(
        '/builder/instance/' + surveyCode + '/deallocateFromCategory',
        qs.stringify({ subCategoryCode: oldCode })
      )
    await this.$axios.patch(
      '/builder/instance/' + surveyCode + '/allocateToCategory',
      qs.stringify({ subCategoryCode: newCode })
    )
    await this.dispatch('categories/getCategories', false, { root: true })
  },

  flagForRemoval({ commit, dispatch }, survey) {
    const tempSurvey = JSON.parse(JSON.stringify(survey))
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/builder/instance/${tempSurvey.code}/flagForRemoval`)
        .then(() => {
          tempSurvey.flags = tempSurvey.flags.filter((item) => {
            return item !== 'ACTIVE'
          })
          tempSurvey.flags.push('FLAGGED_FOR_REMOVAL')
          commit(
            'updateItem',
            {
              which: 'surveys',
              item: tempSurvey,
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

  unFlagForRemoval({ commit, dispatch }, survey) {
    const tempSurvey = JSON.parse(JSON.stringify(survey))
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/builder/instance/${tempSurvey.code}/unflagForRemoval`)
        .then(() => {
          tempSurvey.flags = tempSurvey.flags.filter((item) => {
            return item !== 'FLAGGED_FOR_REMOVAL'
          })

          commit(
            'updateItem',
            {
              which: 'surveys',
              item: tempSurvey,
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

  duplicateSurvey({ commit }, survey) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/builder/instance/' + survey.code)
        .then((response) => {
          commit(
            'newItem',
            { which: 'surveys', item: response.data },
            { root: true }
          )
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteSurvey({ commit, dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/builder/instance/' + code)
        .then(() => {
          // await dispatch('categories/getCategories', false, { root: true })
          commit('deleteSurvey', code)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  generateLanguagePack({ dispatch }, survey) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch('/builder/instance/' + survey.code + '/generateLanguagePack')
        .then(() => {
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  downloadLanguagePack({ dispatch }, survey) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('/builder/instance/languagePack?code=' + survey.code, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => reject(error))
    })
  },

  uploadLanguagePack({ dispatch }, { survey, file }) {
    return new Promise((resolve, reject) => {
      const data = new FormData()
      data.append('languagePackFile', file)
      this.$axios
        .patch(
          '/builder/instance/' + survey.code + '/updateLanguagePack',
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  addCollaborator({ dispatch }, { code, email }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(
          `/builder/instance/${code}/addCollaborator`,
          qs.stringify({ email })
        )
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  removeCollaborator({ dispatch }, { code, email }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(
          `/builder/instance/${code}/removeCollaborator`,
          qs.stringify({ email })
        )
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getCollaborators({ dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`auth/group?gCode=${code}`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  clearKioskMode({ commit }, survey) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/builder/instance/${survey.code}/clearKioskMode`)
        .then(() => {
          const temp = JSON.parse(JSON.stringify(survey))
          temp.flags = temp.flags.filter((el) => {
            return el !== 'KIOSK'
          })
          commit('updateItem', { which: 'surveys', item: temp }, { root: true })
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  setKioskMode({ commit }, survey) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/builder/instance/${survey.code}/setKioskMode`)
        .then(() => {
          const temp = JSON.parse(JSON.stringify(survey))
          temp.flags.push('KIOSK')
          commit('updateItem', { which: 'surveys', item: temp }, { root: true })
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  closeSurvey({ commit }, survey) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/builder/instance/${survey.code}/close`)
        .then((response) => {
          const temp = JSON.parse(JSON.stringify(survey))
          temp.flags = temp.flags.filter((el) => {
            return el !== 'ACTIVE'
          })
          temp.flags.push('EXPIRED')
          commit('updateItem', { which: 'surveys', item: temp }, { root: true })
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  reopenSurvey({ commit }, survey) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/builder/instance/${survey.code}/reopen`)
        .then(() => {
          const temp = JSON.parse(JSON.stringify(survey))
          temp.flags = temp.flags.filter((el) => {
            return el !== 'EXPIRED'
          })
          temp.flags.push('ACTIVE')
          commit('updateItem', { which: 'surveys', item: temp }, { root: true })
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getSurveyData({ commit }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/builder/instance/data?code=${code}`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  generateDataFile({ commit }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(`/builder/instance/${code}/generateDataFile`)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  downloadDataFile({ commit }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/builder/instance/dataFile?code=${code}`, {
          responseType: 'blob',
        })
        .then((response) => {
          // resolve(response.data)
          const fileName = response.headers['content-disposition'].replace(
            'attachment; filename=',
            ''
          )

          const fileDownload = require('js-file-download')
          return fileDownload(response.data, fileName)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
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

export const mutations = {
  setSurveys(state, surveys) {
    state.items = surveys
  },

  newSurvey(state, survey) {
    state.items.push(survey)
  },

  updateSurvey(state, survey) {
    const foundSurvey = state.items.find((el) => {
      return el.code === survey.code
    })
    Object.assign(foundSurvey, survey)
  },

  deleteSurvey(state, code) {
    state.items = state.items.filter((el) => {
      return el.code !== code
    })
  },
}
