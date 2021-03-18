<template>
  <div class="flex flex-1 items-center" @click="show = !show">
    <div class="flex flex-1 items-center relative">
      <i
        class="fas fa-info-circle fa-fw w-8 text-gray-300 hover:text-gray-400 transition duration-300 cursor-pointer"
      >
      </i>

      <div v-show="show" slot="popover" class="info">
        <slot name="text"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupInfo',
  data() {
    return {
      show: false,
    }
  },
}
</script>

<style scoped>
.info {
  @apply absolute border border-gray-100 shadow-sm rounded py-2 px-2 bg-gray-50 text-sm flex flex-1 flex-wrap ml-10;
}
</style>
