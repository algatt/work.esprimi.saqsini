<template>
  <div
    class="fixed top-0 left-0 w-full h-full frosted flex items-center justify-center"
  >
    <div
      class="bg-white px-10 py-4 flex flex-col rounded shadow-lg border border-gray-200"
    >
      <h5 class="self-start text-primary text-lg mb-3">
        <slot name="title"></slot>
      </h5>
      <div class="mb-3"><slot name="message"></slot></div>
      <div class="flex w-full justify-center">
        <button class="btn btn-danger mr-3 w-20" @click="$emit('confirm')">
          Delete
        </button>
        <button class="btn btn-primary w-20" @click="$emit('cancel')">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalConfirm',
}
</script>

<style scoped></style>
