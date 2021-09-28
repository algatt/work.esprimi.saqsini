import cookie from 'cookie'
import cookies from 'js-cookie'
import axios from 'axios'

export const state = () => ({
  selectedContactList: null,
  clientIp: null,
})

export const actions = {
  async nuxtServerInit({ dispatch, commit, state }, context) {
    if (process.server) {
      context.store.commit('setIp', context.req.client._peername)
      const cookies = cookie.parse(context.req.headers.cookie || '')

      if (cookies['x-access-token']) {
        try {
          await context.store.commit(
            'auth/setAuthToken',
            cookies['x-access-token']
          )

          const url = `${context.$config.api_path}${context.$config.api_auth}user`

          const user = await axios.get(url, {
            headers: {
              Authorization: context.$config.authorization,
              token: cookies['x-access-token'],
            },
          })

          context.store.commit('auth/setAuthUser', user.data)
        } catch {
          context.store.commit('auth/setAuthToken', '')
          context.store.commit('auth/setAuthUser', {})
        }
      }
    }
  },

  setContactList({ dispatch, commit }, item) {
    // TODO
    commit('setContactList', item)
    dispatch('contacts/getContacts', {}, { root: true })
    dispatch('departments/getAllDepartments', {}, { root: true })
    dispatch('industries/getIndustries', {}, { root: true })
    dispatch('jobs/getAllJobs', {}, { root: true })
    dispatch('roles/getRoles', {}, { root: true })
    dispatch('sectors/getSectors', {}, { root: true })
    dispatch('companies/getCompanies', {}, { root: true })
  },
}

export const mutations = {
  setContactList(state, item) {
    state.selectedContactList = item
    cookies.set('selectedContactList', item, {
      expires: 7,
      sameSite: 'None',
      secure: true,
    })
  },

  setIp(state, ipAddress) {
    state.clientIp = ipAddress
  },
}

export const getters = {
  getSelectedContactList: (rootState) => {
    if (rootState.selectedContactList) return rootState.selectedContactList
    else if (rootState.contactlist.items.length !== 0)
      return rootState.contactlist[0]
    return null
  },
}
