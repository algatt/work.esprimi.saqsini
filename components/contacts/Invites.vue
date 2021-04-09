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

    <div class="w-full xl:w-9/12 pt-2 flex flex-col h-screen">
      <div class="flex flex-wrap justify-between mb-6">
        <select-base
          v-model="selectedFlag"
          class="pl-3 xl:pl-0 mb-2"
          style="min-width: 150px"
          @input="selectedInvites = []"
        >
          Invite Status
          <template v-slot:options>
            <option :value="null">All</option>
            <option
              v-for="option in availableFlags"
              :key="option.code"
              :value="option.code"
            >
              {{ option.name }}
            </option>
          </template>
        </select-base>
        <div class="flex flex-wrap items-end space-y-2 mb-2 pl-3 xl:pl-0">
          <button-icon
            :disabled="selectedInvites.length === 0"
            class="mr-3"
            bg-colour="red"
            @click="confirmDelete = true"
            >Delete ({{ selectedInvites.length }})<template v-slot:icon
              ><i class="fas fa-trash-alt fa-fw"></i></template
          ></button-icon>
          <button-icon
            class="mr-3"
            :disabled="invites.length === 0"
            @click="selectedInvites = invites"
            >Select All<template v-slot:icon
              ><i class="fas fa-check-double fa-fw"></i></template
          ></button-icon>
          <button-icon
            :disabled="selectedInvites.length === 0"
            @click="selectedInvites = []"
            >Clear Selection<template v-slot:icon
              ><i class="fas fa-times-circle fa-fw"></i></template
          ></button-icon>
        </div>
      </div>
      <div v-if="invites.length > 0" class="flex flex-col shadow rounded">
        <div
          class="flex flex-wrap bg-gray-100 border border-gray-200 py-3 uppercase font-semibold text-gray-700"
        >
          <span class="w-12 flex items-center justify-center"> </span>
          <span class="flex flex-1 flex-wrap">
            <span class="w-full xl:w-4/12">Email</span>
            <span class="w-full xl:w-4/12">Token</span>
            <span class="w-full xl:w-3/12">Flags</span>
          </span>
          <span class="w-12 flex items-center justify-center"></span>
        </div>
        <div
          v-for="invite in invites"
          :key="invite.token"
          class="flex flex-wrap w-full cursor-pointer py-3 border border-gray-100"
          @mouseover="hovered = invite"
          @mouseleave="hovered = null"
          @click="manageSelected(invite)"
        >
          <span class="w-12 flex items-center justify-center"
            ><i
              v-if="existsInSelected(invite)"
              class="fas fa-check-circle fa-fw text-primary"
            ></i
            ><span v-else-if="hovered && hovered.token === invite.token"
              ><i class="fas fa-check-circle fa-fw text-gray-200"></i></span
          ></span>
          <span class="flex flex-1 flex-wrap">
            <span class="w-full xl:w-4/12">{{ invite.email }}</span>
            <span class="w-full xl:w-4/12">{{ invite.token }}</span>
            <span class="w-full xl:w-3/12"
              ><badge-base
                v-for="(flag, index) in processFlags(invite.flags)"
                :key="index"
                class="mr-1"
                :bg-colour="
                  flag === 'Submitted'
                    ? 'green'
                    : flag === 'Notified'
                    ? 'yellow'
                    : 'gray'
                "
                >{{ flag }}</badge-base
              ></span
            >
          </span>

          <span class="w-12 flex items-center justify-center"> </span>
        </div>
      </div>
      <info-box v-else>
        <template v-slot:title>No Invites</template>
        <template v-slot:content>There are no invites here...</template>
      </info-box>
      <div class="mb-10">&nbsp;</div>
    </div>

    <modal-confirm
      v-if="confirmDelete"
      @cancel="confirmDelete = false"
      @confirm="deleteInvites"
      ><template v-slot:title>Delete Invites</template
      ><template v-slot:message>
        Are you sure you want to delete {{ selectedInvites.length }} invites?
      </template></modal-confirm
    >

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
import BadgeBase from '~/components/elements/BadgeBase'
import SelectBase from '~/components/elements/SelectBase'
import ModalConfirm from '~/components/layouts/ModalConfirm'
import InfoBox from '~/components/layouts/InfoBox'

export default {
  name: 'ContactsInvites',
  components: {
    InfoBox,
    ModalConfirm,
    SelectBase,
    BadgeBase,
    InviteByContactList,
    InviteByContacts,
    ButtonIcon,
    InviteByEmail,
    EditObjectModal,
  },
  data() {
    return {
      startInvite: '',
      loading: true,
      hovered: null,
      selectedInvites: [],
      selectedFlag: null,
      confirmDelete: false,
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
    invites() {
      const x = this.$store.getters.getItems('invitations')
      if (!this.selectedFlag) return x
      return x.filter((el) => {
        return el.flags.includes(this.selectedFlag)
      })
    },
    availableFlags() {
      const allFlags = this.invites.map((el) => {
        return el.flags
      })
      const result = []
      allFlags.forEach((flagArr) => {
        flagArr.forEach((flag) => {
          if (
            !result.find((el) => {
              return el.code === flag
            })
          )
            result.push({
              code: flag,
              name:
                flag.substring(0, 1).toUpperCase() +
                flag.substring(1, flag.length).toLowerCase(),
            })
        })
      })
      return result
    },
  },
  created() {
    this.loading = true
    this.$store
      .dispatch('invitations/getAll', { code: this.survey.code })
      .then(() => {
        this.loading = false
      })
      .catch(() => {
        this.$toasted.error('There was a problem loading invitations')
        this.loading = false
      })
  },
  methods: {
    processFlags(flags) {
      const result = []
      flags.forEach((el) => {
        if (el !== 'ACTIVE')
          result.push(
            el.substring(0, 1).toUpperCase() +
              el.substring(1, el.length).toLowerCase()
          )
      })
      return result
    },
    showInviteDialog(which) {
      this.startInvite = which
      this.$store.dispatch('setCurrentItemToBeEdited', this.survey)
    },
    setCurrentItem(item) {
      this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
    manageSelected(invite) {
      if (this.existsInSelected(invite))
        this.selectedInvites = this.selectedInvites.filter((el) => {
          return el.token !== invite.token
        })
      else this.selectedInvites.push(invite)
    },
    existsInSelected(invite) {
      return this.selectedInvites.find((el) => {
        return el.token === invite.token
      })
    },
    deleteInvites() {
      const requests = this.selectedInvites.map((el) => {
        return this.$store.dispatch('invitations/delete', { code: el.token })
      })
      Promise.all(requests).then(() => {
        this.$store.dispatch('invitations/getAll', { code: this.survey.code })
        this.selectedInvites = []
        this.confirmDelete = false
      })
    },
  },
}
</script>

<style scoped></style>
