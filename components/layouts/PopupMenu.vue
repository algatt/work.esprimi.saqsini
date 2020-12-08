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
    <button v-if="showMenu" class="absolute bg-blue-300 min-w-max">
      <div
        id="popupMenuContainer"
        class="absolute flex flex-col z-20 bg-white border-gray-200 rounded shadow min-w-max"
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
      styleForMenu: null,
    }
  },
  computed: {
    // styleForMenu() {
    // const popupMenuRootWidth = document.getElementById('popupMenuRoot')
    //   .clientWidth
    //
    // const width = `width: ${this.width}px`
    // let position = `left: ${-Math.abs(popupMenuRootWidth - this.width) / 2}px`
    // if (this.direction === 'left') position = `right: ${5}px`
    // else if (this.direction === 'right') position = `left: ${5}px`
    //
    // // const position =
    // //   this.direction === 'left' ? `right: ${5}px` : `left: ${5}px`
    // const top = `top: ${30}px`
    // return `${width}; ${position}; ${top}`
    // if (!this.showMenu) return null
    //
    // const rect = document
    //   .getElementById('popupMenuContainer')
    //   .getBoundingClientRect()
    // console.log(rect)
    //   const right = rect.right
    //   const width = rect.width
    //   const windowWidth = window.innerWidth
    //   if (width + right > windowWidth) {
    //     position = `right : 0px`
    //   } else {
    //     position = `left: 0px`
    //   }
    //   return position
    // },
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
          console.log(bottom)
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
  @apply py-2 px-1 text-gray-700 hover:bg-gray-100 transition duration-300;
}
</style>
