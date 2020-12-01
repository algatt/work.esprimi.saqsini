<template>
  <div class="relative">
    <button class="btn-link-rounded relative" @click.stop="showMenu = true">
      <i class="fas fa-ellipsis-v fa-fw"></i>
    </button>
    <button
      v-if="showMenu"
      class="flex flex-col absolute"
      :style="styleForMenu"
    >
      <div
        id="popupMenuContainer"
        class="z-20 bg-white flex flex-col rounded shadow-lg border border-gray-200"
        @click.stop="closeMenu"
      >
        <slot name="menuItems"></slot>
      </div>
      <div
        class="fixed top-0 left-0 w-full h-full z-10 cursor-default"
        @click.stop="closeMenu"
      ></div>
    </button>
  </div>
</template>

<script>
export default {
  name: 'PopupMenuVue',
  props: {
    objectCode: {
      type: Number,
      required: false,
      default: null,
    },
    direction: {
      type: String,
      required: false,
      default: 'left',
    },
    width: {
      type: Number,
      required: false,
      default: 200,
    },
  },
  data() {
    return {
      showMenu: false,
    }
  },
  computed: {
    styleForMenu() {
      const width = `width: ${this.width}px`
      const position =
        this.direction === 'left' ? `right: ${5}px` : `left: ${5}px`
      const top = `top: ${25}px`
      return `${width}; ${position}; ${top}`
    },
  },
  beforeDestroy() {
    this.$emit('closeMenu')
  },
  methods: {
    closeMenu() {
      this.showMenu = false
      this.$emit('closeMenu')
    },
  },
}
</script>

<style scoped>
#popupMenuContainer button {
  @apply py-2 px-1 text-gray-700 hover:bg-gray-100 transition duration-300;
}
</style>
