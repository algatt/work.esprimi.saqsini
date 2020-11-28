<template>
  <div class="bg-gray-200 fixed top-0 left-0 w-full h-full bg-opacity-75 flex">
    <button class="hidden md:flex w-6/12" @click="cancelCurrentItem"></button>
    <div class="w-full md:w-6/12 flex bg-white"></div>
  </div>
</template>

<script>
export default {
  name: 'EditObjectModal',
  methods: {
    cancelCurrentItem() {
      this.$store.dispatch('setCurrentItemToBeEdited', null)
    },
  },
}
</script>

<style scoped></style>
