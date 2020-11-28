<template>
  <div class="w-11/12 mx-auto flex justify-between px-1 h-16 items-center">
    <h6 class="text-lg"><slot name="title"> </slot></h6>
    <button class="btn-primary px-5"><slot name="button"></slot></button>
  </div>
</template>

<script>
export default {
  name: 'BottomInfoBar',
  props: {
    storeObject: {
      type: String,
      required: true,
    },
  },
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
