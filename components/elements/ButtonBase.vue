<template>
  <button
    class="font-medium rounded shadow border text-white focus:outline-none focus:ring-1 focus:ring-offset-2 transition duration-300"
    :class="buttonStyle"
    :disabled="disabled"
    @click="$emit('buttonClick')"
  >
    <span
      class="flex items-stretch"
      :class="$slots.extra ? 'justify-center' : 'justify-between'"
    >
      <span class="py-0.5" :class="$slots.extra ? 'pl-3 pr-2' : 'px-3'">
        <slot></slot>
      </span>
      <span
        v-if="$slots.extra"
        class="flex items-center justify-center w-6 py-0.5"
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
      required: true,
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
      return this.variant === 'normal' ? 500 : 700
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
        return `bg-${this.colour} border-${this.colourDarker} focus:ring-${this.colour} hover:bg-${this.colourDarker}`
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
