<template>
  <span
    class="text-xs rounded-full h-5 w-5 flex items-center justify-center text-white"
    :class="color ? `bg-${color}-400` : `bg-primary-lighter`"
    ><slot></slot
  ></span>
</template>

<script>
export default {
  name: 'RoundColorIcon',
  props: {
    color: {
      type: String,
      default: 'primary',
    },
  },
}
</script>

<style scoped></style>
