<template>
  <button
    class="rounded-full focus:outline-none focus:ring-1 focus:ring-offset-2 transition duration-300 h-6 w-6"
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
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    colourNumber() {
      return this.bgColour === 'gray' ? 300 : 500
    },
    colour() {
      return `${this.bgColour}-${this.colourNumber}`
    },
    colourDarker() {
      return `${this.bgColour}-${this.colourNumber + 200}`
    },
    buttonStyle() {
      if (this.disabled) return `bg-gray-300 border-gray-300 text-gray-200`
      else
        return `bg-white text-${this.colour} focus:ring-${this.colour} hover:text-${this.colourDarker}  focus:text-${this.colourDarker}`
    },
  },
}
</script>

<style scoped></style>
