<template>
  <div class="md:flex">
    <aside
      class="h-screen sticky top-0 bg-blue-600 transition-all duration-300 hidden md:block"
      :class="!menuShow ? 'w-12' : 'w-52'"
    >
      <nav-bar
        :is-visible="menuShow"
        @clickToggle="menuShow = !menuShow"
      ></nav-bar>
    </aside>
    <nav-bar
      class="flex w-full bg-green-500 flex-wrap md:hidden"
      :is-visible="menuShow"
    ></nav-bar>
    <Nuxt class="px-3 flex-grow" />
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
}
</script>
