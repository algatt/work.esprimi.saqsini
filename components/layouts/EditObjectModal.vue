<template>
  <div class="bg-gray-200 fixed top-0 left-0 w-full h-full bg-opacity-75 flex">
    <button class="hidden md:flex w-6/12" @click="cancelCurrentItem"></button>
    <div class="w-full md:w-6/12 flex flex-col bg-white relative">
      <div class="bg-primary p-3 text-white text-lg">
        <h6>
          <span v-if="currentItemToBeEdited.code === -1">New</span>
          <span v-else>Edit</span>
        </h6>
      </div>
      <div class="flex flex-col p-5 bg-red overflow-y-auto mb-10">
        <slot name="content" :item="currentItemToBeEdited"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditObjectModal',
  computed: {
    currentItemToBeEdited() {
      return this.$store.state.currentItemToBeEdited
    },
  },
  mounted() {
    document.documentElement.style.overflow = 'hidden'
    document.body.scroll = 'no'
  },
  destroyed() {
    document.documentElement.style.overflow = 'visible'
    document.body.scroll = 'yes'
  },
  methods: {
    cancelCurrentItem() {
      this.$store.dispatch('setCurrentItemToBeEdited', null)
    },
  },
}
</script>

<style scoped></style>
