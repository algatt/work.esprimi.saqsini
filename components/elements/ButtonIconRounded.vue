<template>
  <button
    class="rounded-full shadow text-white focus:outline-none focus:ring-1 focus:ring-offset-2 transition duration-300 h-6 w-6"
    :class="buttonStyle"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span class="flex items-center justify-center">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'ButtonIconRounded',
  props: {
    bgColour: {
      type: String,
      required: false,
      default: 'blue',
    },
    variant: {
      type: String,
      required: false,
      default: 'normal',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    colourNumber() {
      return this.variant === 'normal'
        ? this.bgColour === 'gray'
          ? 300
          : 500
        : 700
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
