import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getJobsByContact({ commit }, contactCode) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/job/byContact?code=${contactCode}&limit=100&offset=0`)
        .then((response) => {
          commit(
            'setItems',
            { which: 'jobs', items: response.data },
            { root: true }
          )
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  newJob({ commit }, job) {
    delete job.code
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/contact/job/', qs.stringify(job))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  updateJob({ commit }, job) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put('/contact/job/' + job.code, qs.stringify(job))
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  deleteJob({ state, commit, dispatch }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete('/contact/job/' + code)
        .then(() => {
          resolve()
        })
        .catch((error) => reject(error))
    })
  },
}
