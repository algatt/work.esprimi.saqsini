<template>
  <div
    class="fixed top-0 left-0 w-full h-full frosted flex items-center justify-center"
  >
    <div
      class="bg-white p-5 flex flex-col rounded shadow-lg border border-gray-200 w-full md:w-4/12"
      :class="width"
    >
      <h5 class="self-start text-primary text-lg mb-3">
        <slot name="title" class="mb-5"></slot>
      </h5>
      <slot name="body" class="my-5"></slot>
      <div class="flex justify-end w-full">
        <button class="btn btn-secondary" @click="$emit('cancel')">
          Close
        </button>
      </div>
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
