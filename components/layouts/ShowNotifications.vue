<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-2">
      <h6>{{ notification.author.displayName }}</h6>
      <h6>{{ notification.author.email }}</h6>
      <p class="mt-3">{{ notification.subject }}</p>
      <p class="mt-2 mb-3">{{ notification.content }}</p>
      <p
        v-if="notification.linkedEntityTypeFlags.includes('SURVEY')"
        class="my-2"
      >
        <button-base>
          <nuxt-link
            :to="{
              name: 'questions-id',
              params: { id: notification.linkedEntityCode },
            }"
            >Go To Survey</nuxt-link
          ></button-base
        >
      </p>
    </div>
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
import ButtonBase from '~/components/elements/ButtonBase'
export default {
  name: 'ShowNotifications',
  components: { ButtonBase, EditObjectModalBottomPart },
  computed: {
    notification() {
      return this.$store.state.currentItemToBeEdited
    },
  },
}
</script>

<style scoped></style>
