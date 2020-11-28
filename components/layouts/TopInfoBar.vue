<template>
  <div class="w-11/12 mx-auto flex justify-between px-1 h-16 items-center">
    <div class="flex items-center">
      <transition name="fade">
        <span v-if="selectedItems !== 0">
          <button class="btn-round-primary mr-2" @click="emptySelectedItems">
            <i class="fas fa-times fa-fw"></i>
          </button>
          <button class="btn-round-danger mr-2" @click="deleteSelectedItems">
            <i class="far fa-trash-alt fa-fw"></i>
          </button>
          <span v-if="selectedItems === 1"
            >{{ selectedItems }} item selected</span
          >
          <span v-else-if="selectedItems > 1"
            >{{ selectedItems }} items selected</span
          >
        </span>
      </transition>
    </div>
    <div></div>
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
