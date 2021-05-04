<template>
  <div class="min-h-screen flex flex-grow">
    <modal-root></modal-root>
    <top-navigation></top-navigation>
    <nuxt style="padding-top: 3rem"></nuxt>
  </div>
</template>

<script>
import TopNavigation from '~/components/layouts/TopNavigation/TopNavigation'
import ModalRoot from '~/components/elements/Modal/ModalRoot'
export default {
  name: 'AuthLayout',
  components: { ModalRoot, TopNavigation },
}
</script>

<style scoped></style>
