<template>
  <span
    class="text-xs rounded px-1.5 py-0.5 border flex justify-center"
    style="min-width: 1.5rem"
    :class="`bg-${color}-100 border-${color}-200 text-${color}-600`"
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
