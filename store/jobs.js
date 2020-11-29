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

  async updateJob({ commit }, job) {
    const code = job.code
    delete job.code

    if (job.isActive)
      await this.$axios.patch(
        `/contact/job/${code}/setOngoing`,
        {},
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
    else
      await this.$axios.patch(
        `/contact/job/${code}/setPast`,
        {},
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

    return new Promise((resolve, reject) => {
      this.$axios
        .put('/contact/job/' + code, qs.stringify(job))
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

  async setJobActive({ commit }, code) {
    await this.$axios.patch(`/contact/job/${code}/setOngoing`)
  },
}
