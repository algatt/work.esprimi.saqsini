<template>
  <div class="flex flex-col w-full md:w-10/12">
    <h5>{{ notification.author.displayName }}</h5>
    <h5>{{ notification.author.email }}</h5>
    <p class="mt-3">{{ notification.subject }}</p>
    <p class="mt-2 mb-3">{{ notification.content }}</p>
    <p v-if="notification.linkedEntityTypeFlags.includes('SURVEY')">
      <nuxt-link
        :to="{
          name: 'questions-id',
          params: { id: notification.linkedEntityCode },
        }"
        class="btn-primary px-3"
        >Go To Survey</nuxt-link
      >
    </p>
    <edit-object-modal-bottom-part
      :form="{}"
      which="notifications"
      :is-valid="false"
      :show-delete="false"
      :show-save="false"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
export default {
  name: 'ShowNotifications',
  components: { EditObjectModalBottomPart },
  computed: {
    notification() {
      return this.$store.state.currentItemToBeEdited
    },
  },
}
</script>

<style scoped></style>
