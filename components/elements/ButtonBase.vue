<template>
  <button
    class="font-medium rounded shadow border text-white focus:outline-none focus:ring-1 focus:ring-offset-2 transition duration-300"
    :class="buttonStyle"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span
      class="flex items-stretch"
      :class="$slots.extra ? 'justify-center' : 'justify-between'"
    >
      <span class="py-1" :class="$slots.extra ? 'pl-3 pr-2' : 'px-3'">
        <slot></slot>
      </span>
      <span
        v-if="$slots.extra"
        class="flex items-center justify-center px-1 py-1"
        :class="iconStyle"
      >
        <slot name="extra"></slot>
      </span>
    </span>
  </button>
</template>

<script>
export default {
  name: 'ButtonBase',
  props: {
    bgColour: {
      type: String,
      required: false,
      default: 'blue',
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    colourNumber() {
      return this.bgColour === 'gray' ? 300 : 600
    },
    colour() {
      return `${this.bgColour}-${this.colourNumber}`
    },
    colourDarker() {
      return `${this.bgColour}-${this.colourNumber + 100}`
    },
    buttonStyle() {
      if (this.disabled) return `bg-gray-300 border-gray-300 text-gray-200`
      else
        return `bg-${this.colour} border-${this.colourDarker} focus:ring-${this.colour} hover:bg-${this.colourDarker}  focus:bg-${this.colourDarker}`
    },
    iconStyle() {
      if (this.disabled) {
        return `bg-gray-300 text-gray-200`
      } else return `bg-${this.colourDarker}`
    },
  },
}
</script>

<style scoped></style>
