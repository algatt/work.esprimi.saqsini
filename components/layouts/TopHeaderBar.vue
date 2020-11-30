<template>
  <div
    class="w-11/12 mx-auto flex flex-wrap justify-between px-1 h-16 items-center mb-3 md:mb-0"
  >
    <h6 class="text-lg w-full md:w-8/12 mb-1 md:mb-0">
      <slot name="title"> </slot>
    </h6>
    <div class="w-full md:w-4/12 flex justify-start md:justify-end">
      <slot name="button"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopHeaderBar',

  computed: {
    selectedItems() {
      return this.$store.state.selectedItems.length
    },
  },
  methods: {
    emptySelectedItems() {
      this.$store.dispatch('emptySelectedItems')
    },

    deleteSelectedItems() {
      this.$store.dispatch('deleteSelectedItems', this.storeObject)
    },
  },
}
</script>

<style scoped></style>
