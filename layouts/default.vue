<template>
  <div class="md:flex relative">
    <aside
      class="h-screen sticky top-0 bg-primary transition-all duration-300 hidden md:block"
      :class="!menuShow ? 'w-12' : 'w-60'"
    >
      <nav-bar
        :is-visible="menuShow"
        @clickToggle="menuShow = !menuShow"
      ></nav-bar>
    </aside>
    <nav-bar
      class="flex w-full flex-wrap md:hidden"
      :is-visible="menuShow"
    ></nav-bar>

    <div class="flex flex-col flex-1">
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
    // setInterval(() => {
    //   this.getNotifications()
    // }, 30000)
  },
  beforeDestroy() {
    // clearInterval(this.getNotifications)
  },
  methods: {
    getNotifications() {
      if (!this.$store.state.auth.authUser) return
      this.$store.dispatch('notifications/getInboxStats')
    },
  },
}
</script>
