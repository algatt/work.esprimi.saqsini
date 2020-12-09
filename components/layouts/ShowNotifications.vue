<template>
  <div class="flex flex-col w-full md:w-10/12">
    <h5>{{ notification.author.displayName }}</h5>
    <h5>{{ notification.author.email }}</h5>
    <p class="mt-3">{{ notification.subject }}</p>
    <p class="mt-2 mb-3">{{ notification.content }}</p>
  </div>
</template>

<script>
export default {
  name: 'ShowNotifications',
  computed: {
    notification() {
      return this.$store.state.currentItemToBeEdited
    },
  },
}
</script>

<style scoped></style>
