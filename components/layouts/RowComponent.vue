<template>
  <div
    class="flex pl-1 pr-2 xl:px-4 py-3 xl:py-4 transition duration-500 border-b border-gray-200 hover:bg-gray-50 items-center focus:bg-white h-auto cursor-pointer"
    :class="existsInSelectedItems ? null : null"
    @mouseover="mouseOverDiv(item)"
    @mouseleave="mouseExitDiv"
    @click="selectItem(item) /*$emit('clicked', item)*/"
  >
    <button
      class="hidden xl:flex w-12 justify-center items-center cursor-pointer focus:outline-none self-stretch"
      @click.stop="selectItem(item)"
    >
      <span>
        <i
          class="fas fa-check-circle fa-fw transition duration-300"
          :class="
            existsInSelectedItems
              ? 'text-primary'
              : isHovered
              ? 'text-gray-200'
              : 'text-transparent'
          "
        >
        </i>
      </span>
    </button>
    <button
      class="flex xl:hidden w-12 justify-center items-center cursor-pointer focus:outline-none self-stretch"
      @click.stop="selectItem(item)"
    >
      <i
        class="fas fa-check-circle fa-fw transition duration-300"
        :class="existsInSelectedItems ? 'text-primary' : 'text-gray-200'"
      ></i>
    </button>

    <span class="flex flex-wrap flex-1 items-center">
      <slot name="content"></slot
    ></span>
    <span
      class="hidden lg:flex w-12 justify-end xl:justify-center items-center self-stretch"
      @click.stop
    >
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
  },
  data() {
    return {
      isHovered: false,
    }
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
    mouseOverDiv(item) {
      this.isHovered = true
      this.$emit('hovered', item.code)
    },
    mouseExitDiv() {
      this.isHovered = false
      this.$emit('hovered', null)
    },
  },
}
</script>
