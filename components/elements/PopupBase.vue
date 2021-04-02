<template>
  <span class="flex relative items-center">
    <button
      class="focus:outline-none focus:ring-1 focus:ring-gray-300 focus:ring-offset-2 rounded-full w-4 h-4 flex justify-center items-center border"
      @click="managePopup"
    >
      <slot name="icon"></slot>
      <i
        v-if="!$slots.icon"
        class="fas fa-info-circle text-gray-300 border border-gray-400 rounded-full shadow-sm"
      ></i>
    </button>
    <button
      v-if="showPopup"
      class="fixed left-0 top-0 z-10 w-full h-full cursor-default"
      @click="showPopup = false"
    ></button>
    <transition name="fade">
      <span
        v-if="showPopup"
        ref="popup"
        class="bg-gray-100 rounded text-sm px-2 py-1 text-gray-700 border border-gray-300 z-20 absolute flex min-w-max"
        :style="{ left: left + 'px' }"
        >message goes here</span
      >
    </transition>
  </span>
</template>

<script>
export default {
  name: 'PopupBase',

  data() {
    return {
      showPopup: false,
      info: '',
      left: 0,
    }
  },
  methods: {
    managePopup() {
      this.left = 0
      if (this.showPopup) this.showPopup = false
      else {
        this.showPopup = true
        this.$nextTick(() => {
          const obj = this.$refs.popup.getBoundingClientRect()
          const x = obj.x
          const width = obj.width
          const browser = window.innerWidth
          this.info = `${x} --- ${width} --- ${browser}`
          if (x + width > browser) this.left = -width
        })
      }
    },
  },
}
</script>

<style scoped></style>
