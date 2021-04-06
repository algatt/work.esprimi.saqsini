<template>
  <button
    class="font-medium bg-gray-100 text-white focus:outline-none focus:ring-1 focus:ring-offset-2 transition duration-300 rounded-r"
    :class="buttonStyle"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span
      class="flex items-stretch"
      :class="$slots.extra ? 'justify-center' : 'justify-between'"
    >
      <span class="py-1" :class="$slots.extra ? 'pl-3 pr-2' : 'px-1.5'">
        <slot></slot>
      </span>
      <span
        v-if="$slots.extra"
        class="flex items-center justify-center py-1 px-1.5"
      >
        <slot name="extra"></slot>
      </span>
    </span>
  </button>
</template>

<script>
export default {
  name: 'ButtonForInput',
  props: {
    textColour: {
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
      return this.textColour === 'gray' ? 300 : 500
    },
    colour() {
      return `${this.textColour}-${this.colourNumber}`
    },
    colourDarker() {
      return `${this.textColour}-${this.colourNumber + 100}`
    },
    buttonStyle() {
      if (this.disabled) return `bg-gray-100 text-gray-200 cursor-not-allowed`
      else return `text-${this.colour} hover:text-${this.colourDarker}`
    },
  },
}
</script>

<style scoped></style>
