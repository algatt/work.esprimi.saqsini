<template>
  <div class="flex flex-col">
    <label
      v-if="$slots.label"
      class="flex items-center font-semibold mb-2 text-gray-700"
      ><slot name="label"></slot
    ></label>
    <div class="flex items-center space-x-2">
      <p><slot name="leftLabel"></slot></p>
      <div
        class="bg-white transition duration-200 ease-in w-10 h-6 flex items-center border-gray-200"
        style="border-radius: 2em; border-width: 2px"
        :class="
          !changeColor
            ? color
              ? `border-${color}-600`
              : `border-primary`
            : toggleActive
            ? color
              ? `border-${color}-600`
              : `border-primary`
            : null
        "
        @click.stop="
          toggleActive = !toggleActive
          $emit('clicked', toggleActive)
        "
      >
        <div
          class="w-4 h-3.5 transform duration-300 ease-in ml-1"
          style="border-radius: 2em"
          :class="[
            { 'translate-x-3.5': toggleActive },
            changeColor && toggleActive && color ? `bg-${color}-600` : null,
            changeColor && toggleActive && !color ? `bg-primary` : null,
            !changeColor ? (color ? `bg-${color}-600` : `bg-primary`) : null,
            !toggleActive && changeColor ? 'bg-gray-200' : null,
            !toggleActive && !changeColor
              ? color
                ? `bg-${color}-600`
                : `bg-primary`
              : null,
          ]"
        ></div>
      </div>
      <p><slot name="rightLabel"></slot></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LToggle',
  props: {
    checked: {
      required: false,
      type: Boolean,
      default: false,
    },
    changeColor: {
      required: false,
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      toggleActive: false,
    }
  },
  computed: {
    // colorNumber() {
    //   return this.bgColor === 'gray' ? 300 : 600
    // },
    // color() {
    //   return `${this.bgColor}-${this.colorNumber}`
    // },
    // colorDarker() {
    //   return `${this.bgColor}-${this.colorNumber + 100}`
    // },
    // buttonStyle() {
    //   if (this.disabled) return `bg-gray-300 border-gray-300 text-gray-200`
    //   else
    //     return `bg-${this.toggleActive ? this.color : 'gray-300'} border-${
    //       this.colorDarker
    //     } focus:ring-${this.color}  focus:bg-${this.colorDarker}`
    // },
  },
  mounted() {
    this.toggleActive = this.checked
  },
}
</script>
