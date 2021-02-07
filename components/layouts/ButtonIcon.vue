<template>
  <button
    class="btn flex items-center"
    :class="
      colour === 'primary'
        ? 'btn-primary'
        : colour === 'danger'
        ? 'btn-danger'
        : 'btn-secondary'
    "
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot name="text"></slot>
    <span
      class="ml-2 rounded-full text-white h-5 w-5 flex justify-center items-center"
      :class="
        colour === 'primary'
          ? 'bg-primary-darker'
          : colour === 'danger'
          ? 'bg-red-600'
          : 'bg-gray-400'
      "
      ><i class="fa-fw text-xs" :class="icon"></i
    ></span>
  </button>
</template>

<script>
export default {
  name: 'ButtonIcon',
  props: {
    icon: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    colour: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
}
</script>

<style scoped></style>
