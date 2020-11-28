<template>
  <div class="hidden md:flex flex-wrap w-11/12 mx-auto">
    <div
      class="flex flex-wrap p-4 transition duration-300 border-b-2 border-gray-300 w-full font-bold"
    >
      <p class="w-8 flex items-center text-primary">&nbsp;</p>
      <span class="flex flex-grow">
        <slot name="content"></slot>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopTitleBar',
}
</script>

<style scoped></style>
