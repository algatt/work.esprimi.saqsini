<template>
  <screen-overlay :dim="true">
    <slot></slot>
  </screen-overlay>
</template>

<script>
import ScreenOverlay from '~/components/layouts/ScreenOverlay'
export default {
  name: 'Modal',
  components: { ScreenOverlay },
}
</script>

<style scoped></style>
