<template>
  <div class="hover:animate-pulse" @click="$router.push({ name: 'surveys' })">
    <h4
      :class="
        color
          ? color === 'white'
            ? `text-white`
            : `text-${color}-600`
          : 'text-primary'
      "
    >
      <nuxt-link :to="{ name: 'surveys' }">
        saqsini<i class="far fa-comments fa-fw ml-1"></i
      ></nuxt-link>
    </h4>
  </div>
</template>

<script>
export default {
  name: 'AppLogo',
  props: {
    color: {
      type: String,
      default: null,
    },
  },
}
</script>

<style scoped></style>
