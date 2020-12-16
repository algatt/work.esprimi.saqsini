<template>
  <div
    class="flex flex-wrap px-1 md:px-4 py-2 transition duration-300 border-b border-gray-200 bg-gray-100 items-center"
  >
    <span class="hidden md:flex w-12 justify-center text-primary items-center">
      &nbsp;
    </span>
    <span class="hidden md:flex flex-wrap flex-grow items-center font-bold">
      <slot name="content"></slot>
    </span>
    <span
      class="flex md:hidden flex-wrap flex-grow items-center font-bold pl-1"
    >
      <slot name="contentSmall"></slot>
    </span>
    <span class="flex w-12 justify-center items-center"> &nbsp; </span>
  </div>
</template>

<script>
export default {
  name: 'TopTitleBar',
}
</script>

<style scoped></style>
