<template>
  <div class="flex flex-col flex-1 items-center">
    <h6 class="mb-5"><slot name="title"></slot></h6>
    <span class="flex flex-wrap"> <slot name="content"></slot></span>
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
