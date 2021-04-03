<template>
  <div class="frosted">
    <div
      class="bg-white px-10 py-4 flex flex-col rounded shadow-lg border border-gray-200 space-y-5"
    >
      <h5 class="text-primary">
        <slot name="title"></slot>
      </h5>
      <div class="mb-3"><slot name="message"></slot></div>
      <div class="flex w-full justify-center space-x-5">
        <button-base bg-colour="red" @click="$emit('confirm')">
          Delete
        </button-base>
        <button-base bg-colour="gray" @click="$emit('cancel')">
          Cancel
        </button-base>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonBase from '~/components/elements/ButtonBase'
export default {
  name: 'ModalConfirm',
  components: { ButtonBase },
}
</script>

<style scoped></style>
