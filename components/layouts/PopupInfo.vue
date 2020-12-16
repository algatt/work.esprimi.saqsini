<template>
  <v-popover
    class="z-30"
    placement="right"
    trigger="click"
    offset="8"
    boundaries-element="window"
  >
    <i
      class="fas fa-info-circle fa-fw ml-1 text-gray-300 hover:text-gray-400 transition duration-300 cursor-pointer"
    >
    </i>
    <div slot="popover" class="info">
      <slot name="text"></slot></div
  ></v-popover>
</template>

<script>
export default {
  name: 'PopupInfo',
}
</script>

<style scoped>
.info {
  @apply border border-gray-100 shadow-sm rounded py-2 px-2 bg-gray-50 text-sm;
}
</style>
