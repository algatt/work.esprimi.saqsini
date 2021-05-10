<template>
  <span
    class="text-sm rounded px-1.5 py-0.5 border"
    :class="`bg-${color}-200 border-${color}-300 text-${color}-700`"
    ><slot></slot
  ></span>
</template>

<script>
export default {
  name: 'BadgeBase',
  props: {
    color: {
      type: String,
      required: false,
      default: 'gray',
    },
  },
}
</script>

<style scoped></style>
