<template>
  <div class="flex py-5 px-10 border border-gray-100 shadow rounded">
    <div class="flex w-auto justify-center items-center mr-4">
      <p><i class="fas fa-info-circle fa-fw text-2xl text-primary"></i></p>
    </div>
    <div class="flex flex-col align-baseline w-full">
      <h6 class="mb-1"><slot name="title"></slot></h6>
      <span class="flex flex-wrap"> <slot name="content"></slot></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoBox',
}
</script>

<style scoped></style>
