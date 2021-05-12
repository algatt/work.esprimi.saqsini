import qs from 'qs'

export const state = () => ({
  items: [],
})

export const actions = {
  getAllJobs({ commit, rootState }, { limit = 100, offset = 0 }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/contact/job?code=${rootState.selectedContactList.code}&limit=${limit}&offset=${offset}`
        )
        .then((response) => {
          commit('setJobs', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getJobsByContact({ commit }, { limit = 100, offset = 0, contactCode }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `/contact/job/byContact?code=${contactCode}&limit=${limit}&offset=${offset}`
        )
        .then((response) => {
          commit('setJobs', response.data)
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
          commit('newJob', response.data)
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
          commit('setPast', code)
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
          commit('updateJob', response.data)
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
          commit('deleteJob', code)
          resolve()
        })
        .catch((error) => reject(error))
    })
  },

  async setJobActive({ commit }, code) {
    await this.$axios.patch(`/contact/job/${code}/setOngoing`)
    commit('setActive', code)
  },
}

export const mutations = {
  setJobs(state, jobs) {
    state.items = jobs
  },

  newJob(state, job) {
    state.items.push(job)
  },

  setPast(state, code) {
    const obj = state.items.find((el) => {
      return el.code === code
    })
    obj.flags = obj.flags.filter((el) => {
      return el !== 'ONGOING'
    })
    obj.flags.push('PAST')
  },

  setActive(state, code) {
    const obj = state.items.find((el) => {
      return el.code === code
    })
    obj.flags = obj.flags.filter((el) => {
      return el !== 'PAST'
    })
    obj.flags.push('ONGOING')
  },

  updateJob(state, job) {
    const found = state.items.find((el) => {
      return el.code === job.code
    })
    Object.assign(found, job)
  },

  deleteJob(state, code) {
    state.items = state.items.filter((el) => {
      return el.code !== code
    })
  },
}
