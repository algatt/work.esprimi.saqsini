<template>
  <button
    class="font-medium mr-3 px-3 py-1 transition duration-300 rounded hover:text-white"
    :class="isChosen ? `bg-${color}-600 text-white` : `hover:bg-${color}-600`"
    @click="$emit('click')"
  >
    {{ item.text }}
  </button>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    isChosen: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: true,
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
