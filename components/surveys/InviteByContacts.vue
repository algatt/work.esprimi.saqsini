<template>
  <div v-if="!loading" class="flex flex-col mt-5 space-y-8">
    <div class="flex flex-col w-full space-y-3">
      <l-input-button
        v-model="searchField"
        placeholder="Search..."
        :button-disabled="searchField === ''"
        @click="searchField = ''"
      >
        <template v-slot:label>Contacts</template>
        <template v-slot> <i class="fas fa-times fa-fw"></i> </template
      ></l-input-button>
      <div class="flex flex-wrap space-x-2">
        <template v-if="contacts.length !== 0">
          <div
            v-for="contact in contacts"
            :key="contact.code"
            class="mb-1"
            @click="manageSelectedContact(contact)"
          >
            <span
              class="flex flex-col bg-gray-100 border-2 text-sm px-2 py-0.5 rounded cursor-pointer hover:bg-gray-200"
              :class="
                contactIsSelected(contact)
                  ? 'border-primary'
                  : 'border-gray-200'
              "
            >
              <span class="font-semibold">{{ contact.displayName }}</span>
              <span>{{ contact.email }}</span>
              <span v-if="contact.dob"
                >{{ calculateAge(contact.dob) }} years old</span
              >
            </span>
          </div>
        </template>
        <div
          v-else
          class="flex w-full justify-center text-sm font-semibold rounded border-gray-200 py-3"
        >
          No Contacts!
        </div>
      </div>

      <div v-if="contacts.length > 0" class="flex justify-between">
        <p class="mt-2">
          Total Invites
          <l-badge>{{ selectedContacts.length }}</l-badge>
        </p>
        <l-text-link
          v-if="selectedContacts.length !== contacts.length"
          @click="selectAll"
          >Select All</l-text-link
        >
        <l-text-link v-else @click="selectedContacts = []">Clear</l-text-link>
      </div>

      <notification-reminder-section
        :existing-data="form"
        @update="form = $event"
        @error="datesError = $event"
      ></notification-reminder-section>
    </div>
    <div class="w-full flex py-10 flex justify-center">
      <l-button :disabled="!isValid" @click="sendInvites"
        >Send Invites<template v-slot:rightIcon
          ><i class="fas fa-paper-plane fa-fw"></i></template
      ></l-button>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { convertSurveyFromApiToForm } from '~/services/survey-helpers'
import NotificationReminderSection from '~/components/surveys/NotificationReminderSection'
import LTextLink from '~/components/LTextLink'
import LButton from '~/components/LButton'

export default {
  name: 'InviteByContacts',
  components: {
    LButton,
    LTextLink,
    NotificationReminderSection,
  },
  props: {
    survey: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {},
      selectedContacts: [],
      datesError: false,
      loading: true,
      searchField: '',
    }
  },

  computed: {
    isValid() {
      return !this.datesError && this.selectedContacts.length > 0
    },
    parsedSurvey() {
      return convertSurveyFromApiToForm(this.survey)
    },
    contactList() {
      return this.$store.state.selectedContactList
    },
    originalContacts() {
      return this.$store.state.contacts.items
        .filter((el) => {
          return el.email && el.email !== ''
        })
        .sort((a, b) => {
          return a.displayName > b.displayName ? 1 : -1
        })
        .map((el) => {
          return {
            ...el,
            combined: `${el.contactNumber} ${el.displayName.toLowerCase()} ${
              el.dob
            } ${el.email.toLowerCase()} ${el.gender.toLowerCase()}`,
          }
        })
    },
    contacts() {
      if (this.searchField === '') return this.originalContacts
      return this.originalContacts.filter((el) => {
        return el.combined.includes(this.searchField.trim().toLowerCase())
      })
    },
  },
  created() {
    this.loading = true
    this.$store.dispatch('contacts/getContacts', {}).then(() => {
      this.form = JSON.parse(JSON.stringify(this.parsedSurvey))
      this.loading = false
    })
  },
  methods: {
    contactIsSelected(contact) {
      return this.selectedContacts.find((el) => {
        return el.code === contact.code
      })
    },
    manageSelectedContact(contact) {
      if (this.contactIsSelected(contact))
        this.selectedContacts = this.selectedContacts.filter((el) => {
          return el.code !== contact.code
        })
      else this.selectedContacts.push(contact)
    },
    selectAll() {
      this.selectedContacts = JSON.parse(JSON.stringify(this.contacts))
    },
    calculateAge(dob) {
      if (!dob) return null
      return Math.round(
        DateTime.now().diff(DateTime.fromSQL(dob), 'years').as('years')
      )
    },
    sendInvites() {
      const list = {
        surveyCode: this.survey.code,
        filter: null,
        notificationTimestamp: this.form.notificationTimestamp,
        notificationMessage: this.form.notificationMessage,
        reminderTimestamp: this.form.reminderTimestamp,
        reminderMessage: this.form.reminderMessage,
        invites: this.selectedContacts.map((el) => {
          return {
            email: el.email,
            contactBookCode: this.contactList.code,
            externalEntityCode: this.contactList.code,
            filter: JSON.stringify({
              Gender: el.gender ? el.gender : null,
              Age: el.dob ? this.calculateAge(el.dob) : null,
              'Full Name': el.displayName,
            }),
          }
        }),
      }

      this.$store
        .dispatch('invitations/add', list)
        .then(() => {
          this.$toasted.show('Invitations successfully sent')
          this.$store.dispatch('invitations/getAll', { code: this.survey.code })
          this.cancel()
        })
        .catch(() => {
          this.$toasted.show('There was a problem sending the invitations')
        })
    },
  },
}
</script>

<style scoped></style>
