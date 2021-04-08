<template>
  <div class="flex flex-wrap items-start">
    <div class="w-full xl:w-3/12 pt-2">
      <div class="px-3 py-1 mb-2 flex flex-col items-stretch">
        <p class="font-semibold mb-2">Invite using</p>
        <div class="flex flex-col mb-5 w-40">
          <button-icon @click="showInviteDialog('email')">
            Email
            <template v-slot:icon
              ><i class="fas fa-paper-plane fa-fw fa-sm"></i></template
          ></button-icon>
        </div>

        <div v-if="canUseContactBook" class="flex flex-col mb-5 w-40">
          <button-icon @click="showInviteDialog('contacts')">
            Contacts
            <template v-slot:icon
              ><i class="fas fa-paper-plane fa-fw fa-sm"></i></template
          ></button-icon>
        </div>

        <div v-if="canUseContactBook" class="flex flex-col mb-5 w-40">
          <button-icon @click="showInviteDialog('contactlist')">
            Contact List
            <template v-slot:icon
              ><i class="fas fa-paper-plane fa-fw fa-sm"></i></template
          ></button-icon>
        </div>
      </div>
    </div>

    <div class="w-full xl:w-9/12 pt-2">
      Existing invites will be displayed here...
    </div>

    <EditObjectModal v-if="startInvite === 'email' && currentItemToBeEdited">
      <template v-slot:title>Invite by Email</template>
      <template v-slot:content
        ><InviteByEmail :survey="survey"></InviteByEmail
      ></template>
    </EditObjectModal>

    <EditObjectModal
      v-else-if="startInvite === 'contacts' && currentItemToBeEdited"
    >
      <template v-slot:title>Invite By Contacts</template>
      <template v-slot:content
        ><InviteByContacts :survey="survey"></InviteByContacts
      ></template>
    </EditObjectModal>

    <EditObjectModal
      v-else-if="startInvite === 'contactlist' && currentItemToBeEdited"
    >
      <template v-slot:title>Invite By Contact List</template>
      <template v-slot:content
        ><InviteByContactList :survey="survey"></InviteByContactList
      ></template>
    </EditObjectModal>
  </div>
</template>

<script>
import EditObjectModal from '~/components/layouts/EditObjectModal'
import InviteByEmail from '~/components/surveys/InviteByEmail'
import ButtonIcon from '~/components/elements/ButtonIcon'
import InviteByContacts from '~/components/surveys/InviteByContacts'
import InviteByContactList from '~/components/surveys/InviteByContactList'

export default {
  name: 'ContactsInvites',
  components: {
    InviteByContactList,
    InviteByContacts,
    ButtonIcon,
    InviteByEmail,
    EditObjectModal,
  },
  data() {
    return {
      startInvite: '',
    }
  },
  computed: {
    canUseContactBook() {
      return this.$store.getters['auth/getPermissions'].includes('CONTACT_BOOK')
    },
    currentItemToBeEdited() {
      return this.$store.state.currentItemToBeEdited
    },
    survey() {
      return this.$store.state.surveys.items[0]
    },
    contactlists() {
      return this.$store.getters.getItems('contactlist')
    },
  },
  created() {},
  methods: {
    showInviteDialog(which) {
      this.startInvite = which
      this.$store.dispatch('setCurrentItemToBeEdited', this.survey)
    },
  },
}
</script>

<style scoped></style>
