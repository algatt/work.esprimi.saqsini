<template>
  <div class="flex flex-1 border-2 border-gray-100 shadow-sm rounded">
    <div class="flex w-auto justify-center items-center bg-gray-50 p-5 w-24">
      <p>
        <i
          v-if="type === 'info'"
          class="fas fa-info-circle fa-fw text-4xl text-primary"
        ></i>
        <i
          v-if="type === 'error'"
          class="fas fa-times-circle fa-fw text-4xl text-red-600"
        ></i>
      </p>
    </div>
    <div class="flex flex-col flex-1 items-start justify-center p-5">
      <h6 class="mb-1"><slot name="title"></slot></h6>
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
