<template>
  <span class="flex relative items-center mx-1 z-10">
    <button
      ref="popupButton"
      class="focus:outline-none flex justify-center items-center"
      @click="managePopup"
    >
      <slot name="icon"></slot>
      <i
        v-if="!$slots.icon"
        class="fas fa-info-circle text-gray-300 rounded-full shadow-sm hover:text-gray-400 transition duration-300 text-lg"
      ></i>
    </button>

    <button
      v-if="showPopup"
      class="fixed left-0 top-0 z-20 w-full h-full cursor-default bg-opacity-25"
      @click.prevent="closePopup"
    ></button>
    <transition name="fade">
      <span
        v-if="showPopup"
        ref="popup"
        class="bg-gray-100 rounded text-sm px-2 py-1 text-gray-700 border border-gray-300 z-10 absolute flex flex-wrap shadow font-normal"
        :style="{ left: left + 'px', minWidth: width, maxWidth: width }"
        ><slot></slot
      ></span>
    </transition>
  </span>
</template>

<script>
export default {
  name: 'PopupBase',
  props: {
    width: {
      type: String,
      required: false,
      default: '200px',
    },
  },
  data() {
    return {
      showPopup: false,
      info: '',
      left: 0,
    }
  },
  methods: {
    managePopup() {
      console.log('aaa')
      if (!this.$slots.default) return

      this.left = this.$refs.popupButton.clientWidth + 5
      if (this.showPopup) this.showPopup = false
      else {
        this.showPopup = true
        this.$nextTick(() => {
          const obj = this.$refs.popup.getBoundingClientRect()
          const x = obj.x
          const width = obj.width
          const browser = window.innerWidth
          if (x + width > browser) {
            this.left = -width - 10
          }
        })
      }
    },
    closePopup() {
      this.managePopup()
    },
  },
}
</script>

<style scoped></style>
