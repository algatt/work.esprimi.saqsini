s
<template>
  <button
    class="border px-1 rounded text-white flex items-stretch shadow transition duration-300 focus:ring-1 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed focus:transition focus:duration-300 h-8"
    :class="
      color
        ? `disabled:bg-${color}-300 disabled:border-${color}-400 bg-${color}-600 hover:bg-${color}-700 border-${color}-700 focus:ring-${color}-700`
        : `disabled:bg-primary-lighter disabled:border-primary-lighter bg-primary hover:bg-primary-darker border-primary-darker focus:ring-primary-700`
    "
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span
      v-if="$slots.leftIcon"
      class="flex items-center transition duration-300"
      ><slot name="leftIcon"></slot
    ></span>
    <span
      v-if="$slots.default"
      class="font-medium py-1 px-2 flex-1 flex items-center justify-center"
      ><slot></slot
    ></span>
    <span
      v-if="$slots.rightIcon"
      class="flex items-center transition duration-300"
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
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>

<style scoped></style>
