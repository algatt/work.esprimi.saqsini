<template>
  <div
    class="flex flex-wrap p-4 transition duration-300 border-b border-gray-200 hover:bg-gray-100 items-center md:h-20"
    :class="existsInSelectedItems ? 'bg-gray-100' : null"
    @click="selectItem(item)"
    @mouseover="$emit('hovered', item.code)"
    @mouseleave="$emit('hovered', null)"
  >
    <p
      class="w-full md:w-8 flex justify-end md:justify-center text-primary items-center"
    >
      <i
        class="fas fa-check-circle"
        :class="existsInSelectedItems ? 'visible' : 'invisible'"
      ></i>
    </p>
    <span class="flex flex-wrap md:flex-grow w-full md:w-auto items-center">
      <slot name="content"></slot
    ></span>
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
