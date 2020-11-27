import cookie from 'cookie'

export const actions = {
  async nuxtServerInit({ dispatch, commit, state }, context) {
    if (process.server) {
      const cookies = cookie.parse(context.req.headers.cookie || '')

      if (cookies['x-access-token']) {
        try {
          context.store.commit('auth/setAuthToken', cookies['x-access-token'], {
            root: true,
          })

          const user = await context.app.$axios.get(
            process.env.api_path + process.env.api_auth + 'user'
          )
          commit('auth/setAuthUser', user.data)
        } catch (e) {
          await context.store.commit('auth/setAuthToken', null, { root: true })
        }
      }
    }
  },
}
