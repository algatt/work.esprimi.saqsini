<template>
  <span class="flex relative items-center">
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
      class="fixed left-0 top-0 z-30 w-full h-full cursor-default"
      @click="closePopup"
    ></button>

    <span
      v-if="showPopup"
      ref="popup"
      class="rounded min-w-max text-gray-700 border border-gray-300 z-40 absolute flex flex-col shadow popup-menu bg-white"
      :style="{
        left: left + 'px',
        top: top + 'px',
      }"
      @click="closePopup"
      ><slot name="menu"></slot
    ></span>
  </span>
</template>

<script>
export default {
  name: 'PopupMenu',
  props: {
    width: {
      type: String,
      required: false,
      default: 'auto',
    },
  },
  data() {
    return {
      showPopup: false,
      info: '',
      left: 0,
      top: 0,
    }
  },
  methods: {
    managePopup() {
      this.top = this.$refs.popupButton.clientHeight + 5
      this.left = 0

      if (this.showPopup) this.closePopup()
      else {
        this.showPopup = true
        this.$nextTick(() => {
          const obj = this.$refs.popup.getBoundingClientRect()
          const x = obj.x
          const width = obj.width
          if (x - width > 0) {
            this.left = -width + this.$refs.popupButton.clientWidth
          }

          const y = obj.y
          const height = obj.height
          const clientHeight = window.innerHeight
          if (y + height > clientHeight) this.top = -height
        })
      }
    },
    closePopup() {
      this.showPopup = false
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
.popup-menu >>> span {
  @apply flex items-center w-full px-5 text-gray-500 py-2 hover:bg-gray-100 cursor-pointer transition duration-300;
}

.popup-menu >>> span > i {
  @apply mr-2 text-gray-300;
}
</style>
