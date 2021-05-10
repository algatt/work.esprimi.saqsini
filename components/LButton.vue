<template>
  <button
    class="border rounded text-white flex items-stretch shadow transition duration-300 disabled:bg-gray-300 disabled:border-gray-400 focus:ring-1 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed focus:transition focus:duration-300 h-8"
    :class="`bg-${color}-600 hover:bg-${color}-700 border-${color}-700 focus:ring-${color}-700`"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span
      v-if="$slots.leftIcon"
      class="flex items-center px-0.5"
      :class="disabled ? 'bg-gray-300' : `bg-${color}-700`"
      ><slot name="leftIcon"></slot
    ></span>
    <span class="font-medium py-1 px-2 flex-1 flex items-center"
      ><slot></slot
    ></span>
    <span
      v-if="$slots.rightIcon"
      class="flex items-center px-0.5"
      :class="disabled ? 'bg-gray-300' : `bg-${color}-700`"
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
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>

<style scoped></style>
