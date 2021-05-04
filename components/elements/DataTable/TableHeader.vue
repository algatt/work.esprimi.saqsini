<template>
  <div class="w-full mb-2 flex flex-wrap h-12">
    <div class="flex items-center w-full md:flex-1 mb-2 md:mb-0">
      <slot name="left"></slot>
    </div>
    <div class="flex items-center w-full md:w-auto justify-end">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableHeader',
}
</script>

<style scoped></style>
