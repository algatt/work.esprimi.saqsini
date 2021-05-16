<template>
  <div
    class="fixed top-0 left-0 w-full h-full frosted flex items-center justify-center"
  >
    <div
      class="bg-white px-10 py-5 flex flex-col rounded shadow-lg border border-gray-200 w-full md:w-auto"
    >
      <h5 class="text-primary mb-3">
        <slot name="title"></slot>
      </h5>
      <slot name="body" class="text-gray-800 my-5"></slot>
      <div class="flex justify-end w-full">
        <slot name="buttons"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalGeneric',
}
</script>

<style scoped></style>
