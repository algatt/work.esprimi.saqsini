<template>
  <button
    class="font-semibold border-b border-transparent transition duration-300 cursor-pointer focus:outline-none active:outline-none focus:ring-0"
    :class="`text-${color}-500 hover:border-${color}-500 hover:text-${color}-600`"
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
      required: false,
      default: 'blue',
    },
  },
}
</script>

<style scoped></style>
