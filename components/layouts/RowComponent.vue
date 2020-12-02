<template>
  <div
    class="flex pl-1 pr-2 md:px-4 py-3 md:py-2 transition duration-300 border-b border-gray-200 hover:bg-gray-100 items-center focus:bg-white"
    :class="existsInSelectedItems ? 'bg-gray-100 ' + heightOfRow : heightOfRow"
    @click="selectItem(item)"
    @mouseover="$emit('hovered', item.code)"
    @mouseleave="$emit('hovered', null)"
  >
    <span class="hidden md:flex w-8 justify-center text-primary items-center">
      <i
        class="fas fa-check-circle"
        :class="existsInSelectedItems ? 'visible' : 'invisible'"
      ></i>
    </span>
    <span class="flex flex-wrap flex-grow items-center">
      <slot name="content"></slot
    ></span>
    <span class="flex w-10 md:w-8 justify-end md:justify-center items-center">
      <slot name="popup-menu"></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'RowComponent',
  props: {
    item: {
      required: true,
      type: Object,
    },
    heightOfRow: {
      required: false,
      type: String,
      default: 'h-auto md:h-14',
    },
  },
  computed: {
    selectedItems() {
      return this.$store.state.selectedItems
    },
    existsInSelectedItems() {
      return this.selectedItems.find((x) => {
        return x.code === this.item.code
      })
    },
  },

  methods: {
    selectItem(item) {
      this.$store.dispatch('selectedItemsManage', item)
    },
  },
}
</script>
