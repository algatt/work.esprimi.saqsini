<template>
  <span
    class="text-xs rounded-full h-5 w-5 flex items-center justify-center"
    :class="`text-${color}-300 bg-${color}-50`"
    ><slot></slot
  ></span>
</template>

<script>
export default {
  name: 'RoundColorIcon',
  props: {
    color: {
      type: String,
      default: 'blue',
    },
  },
}
</script>

<style scoped></style>
