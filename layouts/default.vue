<template>
  <div class="min-h-screen flex flex-col bg-white flex-1">
    <nav-bar />
    <div class="flex-1 px-5 pb-10" style="margin-top: 3rem">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import NavBar from '~/components/layouts/NavBar'
export default {
  name: 'Saqsini',
  components: { NavBar },
  middleware: 'auth',
  data() {
    return {
      menuShow: true,
    }
  },
  created() {
    this.getNotifications()
    setInterval(() => {
      this.getNotifications()
    }, 30000)
  },
  beforeDestroy() {
    clearInterval(this.getNotifications)
  },
  methods: {
    getNotifications() {
      if (!this.$store.state.auth.authUser) return
      this.$store.dispatch('notifications/getInboxStats')
    },
  },
}
</script>
