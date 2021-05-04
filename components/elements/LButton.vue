<template>
  <button
    class="border rounded text-white flex items-center shadow transition duration-300 disabled:bg-gray-300 disabled:border-gray-400 focus:ring-1 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed focus:transition focus:duration-300 h-8"
    :class="bgColor"
    v-on:="$listeners"
    @click="$emit('click')"
  >
    <span
      v-if="$slots.leftIcon"
      class="py-1 px-0.5 rounded-l"
      :class="isDisabled ? 'bg-gray-300' : `bg-${hoverColor}`"
      ><slot name="leftIcon"></slot
    ></span>
    <span class="font-medium py-1 px-2 flex-1"><slot></slot></span>
    <span
      v-if="$slots.rightIcon"
      class="py-1 px-0.5 rounded-r"
      :class="isDisabled ? 'bg-gray-300' : `bg-${hoverColor}`"
      ><slot name="rightIcon"></slot
    ></span>
  </button>
</template>

<script>
export default {
  name: 'LButton',
  props: {
    color: {
      type: String,
      required: false,
      default: 'blue',
    },
  },
  data() {
    return {
      baseNumber: 600,
      hoverNumber: 700,
    }
  },
  computed: {
    baseColor() {
      return `${this.color}-${this.baseNumber}`
    },
    hoverColor() {
      return `${this.color}-${this.hoverNumber}`
    },
    bgColor() {
      return `bg-${this.baseColor} hover:bg-${this.hoverColor} border-${this.hoverColor} focus:ring-${this.hoverColor}`
    },
    isDisabled() {
      return this.$attrs.disabled ? this.$attrs.disabled : false
    },
  },
  mounted() {
    if (this.color === 'gray') {
      this.baseNumber -= 200
      this.hoverNumber -= 200
    }
  },
}
</script>

<style scoped></style>
