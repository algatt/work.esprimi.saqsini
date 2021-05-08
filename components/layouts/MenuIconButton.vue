<template>
  <button
    class="items-center md:flex md:justify-center font-semibold hover:text-primary transition duration-300 focus:outline-none py-3 mr-6"
    :class="
      active
        ? `text-${color}-600 border-b-2 border-${color}-600`
        : 'text-gray-500'
    "
    @click="$emit('click')"
  >
    <span class="xl:pr-1"><slot name="icon"></slot></span>
    <span class="hidden md:block"><slot></slot></span>
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
