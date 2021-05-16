<template>
  <div class="min-h-screen flex flex-col w-full">
    <modal-root></modal-root>
    <top-navigation></top-navigation>
    <div class="w-full flex flex-col">
      <nuxt style="padding-top: 3rem"></nuxt>
    </div>
  </div>
</template>

<script>
import TopNavigation from '~/components/elements/TopNavigation/TopNavigation'
import ModalRoot from '~/components/elements/Modal/ModalRoot'
export default {
  name: 'AuthLayout',
  components: { ModalRoot, TopNavigation },
}
</script>

<style scoped></style>
