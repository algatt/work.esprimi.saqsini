<template>
  <screen-overlay :dim="true">
    <slot></slot>
  </screen-overlay>
</template>

<script>
import ScreenOverlay from '~/components/elements/ScreenOverlay'
export default {
  name: 'Modal',
  components: { ScreenOverlay },
  mounted() {
    document.documentElement.style.overflow = 'hidden'
    document.body.scroll = 'no'
  },
  destroyed() {
    document.documentElement.style.overflow = 'visible'
    document.body.scroll = 'yes'
  },
}
</script>

<style scoped></style>
