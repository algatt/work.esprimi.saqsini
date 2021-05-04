<template>
  <div class="flex relative mr-3" @click="$emit('click')">
    <img
      v-if="avatar && avatar !== ''"
      :src="avatar"
      class="h-8 w-8 rounded-full cursor-pointer border-2 transition duration-300"
      :class="[isChosen ? `border-${color}-600` : `hover:border-${color}-600`]"
    />
    <div
      v-else
      class="h-8 w-8 flex items-center border-2 cursor-pointer justify-center rounded-full transition duration-300"
      :class="[isChosen ? `border-${color}-600` : `hover:border-${color}-600`]"
    >
      <i class="fas fa-user"></i>
    </div>
    <div
      v-if="unreadMessages && unreadMessages !== 0"
      class="absolute top-0 right-0 bg-white border border-gray-300 text-xs px-0.5 rounded bg-opacity-75"
    >
      {{ unreadMessages }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuAccount',
  props: {
    isChosen: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      required: false,
      default: 'blue',
    },
  },
  computed: {
    avatar() {
      return this.$store.state.auth.authUserAvatar
    },
    unreadMessages() {
      return this.$store.state.notifications.notificationStats?.unreadCount
    },
  },
  mounted() {
    this.getStatistics()
    setInterval(this.getStatistics, 30000)
  },
  beforeDestroy() {
    clearInterval(this.getStatistics)
  },
  methods: {
    getStatistics() {
      this.$store.dispatch('notifications/getInboxStats').catch(() => {
        clearInterval(this.getStatistics)
      })
    },
  },
}
</script>

<style scoped></style>
