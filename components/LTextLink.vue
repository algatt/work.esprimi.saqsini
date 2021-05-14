<template>
  <button
    class="font-semibold border-b-2 border-transparent transition duration-300 cursor-pointer focus:outline-none active:outline-none focus:ring-0"
    :class="
      color
        ? `text-${color}-500 hover:border-${color}-500 hover:text-${color}-600`
        : `text-primary hover:border-primary hover:text-primary-darker`
    "
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'LTextLink',
  props: {
    color: {
      type: String,
      default: null,
    },
  },
}
</script>

<style scoped></style>
