<template>
  <div class="w-full flex flex-wrap">
    <div class="sidebar-width">
      <slot name="sidebar"></slot>
    </div>
    <div class="w-full md:w-auto md:flex-grow p-2 md:pr-5">
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
