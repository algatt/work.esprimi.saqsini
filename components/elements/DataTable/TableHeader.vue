<template>
  <div class="w-full flex flex-wrap items-center">
    <div class="flex items-center w-full md:w-6/12 space-x-2 mb-4">
      <slot name="left"></slot>
    </div>
    <div
      class="flex items-center w-full md:w-6/12 space-x-2 justify-start md:justify-end mb-4"
    >
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
