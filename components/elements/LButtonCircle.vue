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
  name: 'LButtonCircle',
  props: {
    color: {
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
    colorNumber() {
      return this.color === 'gray' ? 300 : 600
    },
    baseColor() {
      return `${this.color}-${this.colorNumber}`
    },
    colorDarker() {
      return `${this.color}-${this.colorNumber + 100}`
    },
    buttonStyle() {
      if (this.disabled) return `bg-gray-300 border-gray-300 text-gray-200`
      else
        return `bg-${this.baseColor} border-${this.colorDarker} focus:ring-${this.baseColor} hover:bg-${this.colorDarker}  focus:bg-${this.colorDarker}`
    },
    iconStyle() {
      if (this.disabled) {
        return `bg-gray-300 text-gray-200`
      } else return `bg-${this.colorDarker}`
    },
  },
}
</script>

<style scoped></style>
