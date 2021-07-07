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
      <span v-if="isDev" title="Development Site"
        ><i class="fas fa-hard-hat fa-sm fa-fw text-yellow-400"></i
      ></span>
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
  computed: {
    isDev() {
      return process.env.NODE_ENV === 'development'
    },
  },
}
</script>

<style scoped></style>
