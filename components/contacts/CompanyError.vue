<template>
  <div class="w-full flex justify-center items-start">
    <div class="flex p-5 flex-wrap">
      <div class="w-16 flex justify-center items-center">
        <i class="fas fa-exclamation-circle fa-2x fa-fw text-red-600"></i>
      </div>
      <div class="flex flex-col">
        <p>You do not have any companies.</p>
        <p>
          Go
          <l-text-link @click="$router.push({ name: 'companies' })"
            >here</l-text-link
          >
          and create one.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyError',
}
</script>

<style scoped></style>
