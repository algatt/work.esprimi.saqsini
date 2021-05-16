<template>
  <div class="w-full flex justify-center items-start">
    <div class="flex p-5 flex-wrap">
      <div class="w-16 flex justify-center items-center">
        <i class="fas fa-exclamation-circle fa-2x fa-fw text-red-600"></i>
      </div>
      <div class="flex flex-1 flex-col">
        <p>There was a problem loading the page.</p>
        <p>
          Try reloading the page or go to
          <l-text-link @click="$router.push({ name: 'index' })"
            >home page</l-text-link
          >.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageLoadError',
}
</script>

<style scoped></style>
