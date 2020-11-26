<template>
  <div class="flex bg-white">
    <aside
      class="h-screen sticky top-0 bg-blue-600"
      :class="
        !menuShow
          ? 'transform -translate-x-40 transition duration-300'
          : 'transition duration-300'
      "
      style="width: 210px"
    >
      <nav-bar
        :is-hidden="menuShow"
        @clickToggle="menuShow = !menuShow"
      ></nav-bar>
    </aside>
    <Nuxt
      class="px-3"
      :class="
        !menuShow
          ? 'transform -translate-x-40 transition duration-300'
          : 'transition duration-300'
      "
    />
  </div>
</template>

<script>
import NavBar from '~/components/layouts/NavBar'
export default {
  components: { NavBar },
  data() {
    return {
      menuShow: true,
    }
  },
}
</script>
