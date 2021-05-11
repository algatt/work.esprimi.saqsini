<template>
  <button
    class="flex items-center font-semibold transition duration-300 focus:outline-none py-3 mx-2"
    :class="
      active
        ? `text-${color}-600 border-b-2 border-${color}-600 hover:text-${color}-700`
        : 'text-gray-500 border-b-2 border-transparent'
    "
    @click="$emit('click')"
  >
    <span class="mr-2"><slot name="icon"></slot></span>
    <span class=""><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: 'MenuIconButton',
  props: {
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: 'blue',
    },
  },
}
</script>

<style scoped></style>
