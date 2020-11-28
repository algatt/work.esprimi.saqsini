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

    <div class="px-3 pt-3 pb-1 w-full flex flex-col"><Nuxt /></div>
  </div>
</template>

<script>
import NavBar from '~/components/layouts/NavBar'
export default {
  components: { NavBar },
  middleware: 'auth',
  data() {
    return {
      menuShow: true,
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
  },
}
</script>
