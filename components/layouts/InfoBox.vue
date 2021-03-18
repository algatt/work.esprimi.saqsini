<template>
  <div class="flex flex-1 border-1 border-gray-100 shadow rounded">
    <div class="flex justify-center items-center p-3 w-16">
      <p>
        <i
          v-if="type === 'info'"
          class="fas fa-info-circle fa-fw text-2xl text-primary"
        ></i>
        <i
          v-if="type === 'error'"
          class="fas fa-times-circle fa-fw text-2xl text-red-600"
        ></i>
      </p>
    </div>
    <div class="flex flex-col flex-1 items-start justify-center p-3">
      <p class="text-gray-600 font-bold mb-2"><slot name="title"></slot></p>
      <span class="flex flex-wrap"> <slot name="content"></slot></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoBox',
  props: {
    type: {
      required: false,
      type: String,
      default: 'info',
    },
  },
}
</script>

<style scoped></style>
