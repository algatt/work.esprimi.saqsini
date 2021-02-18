<template>
  <div id="popupMenuRoot" class="relative">
    <button
      class="relative flex items-center justify-center"
      :class="$slots.menuButton ? null : 'btn-link-rounded'"
      @click.stop="changeShowMenu"
    >
      <slot name="menuButton"></slot>
      <i v-if="!$slots.menuButton" class="fas fa-ellipsis-v fa-fw"></i>
    </button>
    <button v-if="$slots.menuItems && showMenu" class="absolute flex p-3 mt-2">
      <div
        id="popupMenuContainer"
        class="absolute flex flex-col z-20 bg-white border border-gray-200 rounded shadow"
        style="min-width: max-content; width: 150px"
        :style="styleForMenu"
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
  },
  data() {
    return {
      showMenu: false,
      styleForMenu: null,
    }
  },

  beforeDestroy() {
    this.$emit('closeMenu')
  },
  methods: {
    closeMenu() {
      this.changeShowMenu()
      this.$emit('closeMenu')
    },
    changeShowMenu() {
      if (!this.$slots.menuItems) return
      this.showMenu = !this.showMenu

      this.$nextTick(() => {
        if (this.showMenu) {
          const rect = document
            .getElementById('popupMenuContainer')
            .getBoundingClientRect()

          const right = rect.right
          const bottom = rect.bottom
          const windowWidth = window.innerWidth
          const windowHeight = window.innerHeight

          if (right > windowWidth) {
            this.styleForMenu = `left : -${right - windowWidth + 25}px`
          } else {
            this.styleForMenu = `left: 0px`
          }
          if (bottom > windowHeight) {
            this.styleForMenu += `;bottom: ${35}px`
          } else {
            this.styleForMenu += `;top: 0px`
          }
        }
      })

      if (!this.showMenu) this.styleForMenu = null
    },
  },
}
</script>

<style scoped>
#popupMenuContainer button {
  @apply py-1 px-1 text-gray-700 hover:bg-gray-100 transition duration-300;
}
</style>
