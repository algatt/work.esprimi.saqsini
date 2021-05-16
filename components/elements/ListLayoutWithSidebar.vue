<template>
  <div class="flex flex-wrap">
    <div class="flex flex-col sidebar-width p-3">
      <slot name="sidebar"></slot>
    </div>
    <div class="flex flex-col md:flex-grow w-full md:w-auto p-3">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListLayoutWithSidebar',
}
</script>

<style scoped>
@media only screen and (max-width: 767px) {
  .sidebar-width {
    @apply w-full;
  }
}

@media only screen and (min-width: 768px) {
  .sidebar-width {
    max-width: 450px;
    min-width: 450px;
  }
}
</style>
