<template>
  <button
    class="font-medium rounded shadow border text-white focus:outline-none focus:ring-1 focus:ring-offset-2 transition duration-300"
    :class="buttonStyle"
    :disabled="isAnimated || disabled"
    @click="clickedButton"
  >
    <span class="flex items-stretch justify-between">
      <span
        v-if="isAnimated"
        class="flex items-center justify-center px-2 py-0.5"
      >
        <slot name="icon"></slot>
      </span>
      <span class="py-0.5" :class="isAnimated ? 'pr-3' : 'px-2'">
        <slot></slot>
      </span>
    </span>
  </button>
</template>

<script>
export default {
  name: 'ButtonAnimated',
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
  data() {
    return {
      isAnimated: false,
    }
  },
  computed: {
    colourNumber() {
      return this.variant === 'normal' ? 600 : 700
    },
    colour() {
      return `${this.bgColour}-${this.colourNumber}`
    },
    colourDarker() {
      return `${this.bgColour}-${this.colourNumber + 100}`
    },
    buttonStyle() {
      if (this.disabled || this.isAnimated)
        return `bg-gray-300 border-gray-300 text-gray-200 focus:outline-none focus:ring-0 active:ring-0 disabled:ring-0`
      else
        return `bg-${this.colour} border-${this.colourDarker} focus:ring-${this.colour} hover:bg-${this.colourDarker}`
    },
  },
  methods: {
    clickedButton() {
      this.isAnimated = true
      this.$emit('click')
    },
  },
}
</script>

<style scoped></style>
