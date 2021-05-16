<template>
  <div
    class="fixed top-0 left-0 w-full h-full z-30 flex justify-center items-center cursor-default"
    :class="dim ? 'bg-gray-100 bg-opacity-50' : null"
    @click.stop="$emit('click')"
  >
    <slot name="default"></slot>
  </div>
</template>

<script>
export default {
  name: 'ScreenOverlay',
  props: {
    dim: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>

<style scoped></style>
