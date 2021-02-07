<template>
  <div></div>
</template>

<script>
export default {
  name: 'LogoutVue',
  created() {
    this.$store.dispatch('auth/logout').then(() => {
      this.$router.push('/')
    })
  },
}
</script>

<style scoped></style>
