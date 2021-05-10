<template>
  <span class="flex relative items-center">
    <div
      ref="popupButton"
      class="focus:outline-none flex justify-center items-center"
      @click.stop="managePopup"
    >
      <slot name="icon"></slot>
      <i
        v-if="!$slots.icon"
        class="fas fa-ellipsis-v fa-fw fa-sm text-gray-300 rounded-full border-2 border-gray-200 h-6 w-6 bg-gray-50 flex items-center justify-center shadow-sm hover:text-gray-400 transition duration-300"
      ></i>
    </div>

    <screen-overlay v-if="showPopup" @click="closePopup">
      <div
        ref="popup"
        class="rounded min-w-max text-gray-700 border border-gray-300 z-20 fixed flex flex-col shadow popup-menu bg-white"
        :style="{
          left: left + 'px',
          top: top + 'px',
        }"
        @click.stop="closePopup"
      >
        <slot name="menu"></slot>
      </div>
    </screen-overlay>
  </span>
</template>

<script>
import ScreenOverlay from '~/components/layouts/ScreenOverlay'
export default {
  name: 'LPopupMenu',
  components: { ScreenOverlay },
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
    managePopup(ev) {
      const popupButton = this.$refs.popupButton.getBoundingClientRect()
      this.top = popupButton.bottom
      this.left = popupButton.right

      // const clientWidth = window.innerWidth
      const clientHeight = window.innerHeight

      if (this.showPopup) this.closePopup()
      else {
        this.showPopup = true
        this.$nextTick(() => {
          const obj = this.$refs.popup.getBoundingClientRect()
          this.left = this.left - obj.width
          if (obj.height + this.top > clientHeight) this.top -= obj.height
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
.popup-menu >>> button {
  @apply flex items-center w-full px-5 text-gray-500 py-2 hover:bg-gray-100 cursor-pointer transition duration-300 font-medium;
}

.popup-menu >>> button > i {
  @apply mr-2 text-gray-300;
}
</style>
