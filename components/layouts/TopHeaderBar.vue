<template>
  <div class="w-11/12 mx-auto flex justify-between px-1 h-16 items-center">
    <h6 class="text-lg"><slot name="title"> </slot></h6>
    <div>
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
