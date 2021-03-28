<template>
  <div
    class="fixed top-0 left-0 w-full h-full frosted flex items-center justify-center"
  >
    <div
      class="bg-white px-10 py-10 flex justify-center items-center rounded shadow-lg border border-gray-200"
      :class="width"
    >
      <slot name="title"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalGeneric',
  props: {
    width: {
      type: String,
      required: false,
      default: 'w-32',
    },
  },
}
</script>

<style scoped></style>
