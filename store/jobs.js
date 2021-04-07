import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getAllJobs({ commit }, { contactList, limit, offset }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/contact/job?code=${contactList}&limit=${limit}&offset=${offset}`)
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

  newJob({ dispatch, commit }, job) {
    delete job.code

    return new Promise((resolve, reject) => {
      this.$axios
        .post('/contact/job/', qs.stringify(job))
        .then(async (response) => {
          if (!job.isActive) {
            await dispatch('setPast', response.data.code)
            response.data.flags = response.data.flags.filter((el) => {
              return el !== 'ONGOING'
            })
            response.data.flags.push('PAST')
          }
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  setPast({ commit }, code) {
    return new Promise((resolve, reject) => {
      this.$axios
        .patch(
          `/contact/job/${code}/setPast`,
          {},
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
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

  async updateJob({ commit }, job) {
    const code = job.code
    delete job.code

    const companyName = job.companyName
    const departmentName = job.departmentName
    const roleName = job.roleName

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
          response.data.companyName = companyName
          response.data.departmentName = departmentName
          response.data.roleName = roleName
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
