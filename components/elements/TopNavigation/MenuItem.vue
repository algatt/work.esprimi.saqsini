<template>
  <button
    class="font-medium mr-3 px-3 py-1 transition duration-300 rounded hover:text-white"
    :class="
      isChosen
        ? color
          ? `bg-${color}-600 text-white`
          : `bg-primary`
        : color
        ? `hover:bg-${color}-600`
        : `hover:bg-primary`
    "
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
      default: null,
    },
  },
}
</script>

<style scoped></style>
