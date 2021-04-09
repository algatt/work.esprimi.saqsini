<template>
  <div v-if="!loading" class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
      <div class="flex flex-col">
        <p class="font-semibold mb-1">Contacts</p>
        <input-base-with-button
          v-if="contacts.length > 0"
          v-model="searchField"
          placeholder="Search..."
          class="mb-2"
          ><template v-slot:button>
            <button-for-input
              :disabled="searchField === ''"
              @click="searchField = ''"
              ><i class="fas fa-times fa-fw"></i
            ></button-for-input> </template
        ></input-base-with-button>
        <div v-if="contacts.length !== 0" class="flex flex-wrap">
          <div
            v-for="contact in contacts"
            :key="contact.code"
            @click="manageSelectedContact(contact)"
          >
            <span
              class="flex flex-col mr-2 bg-gray-100 border-2 text-sm px-2 py-0.5 rounded cursor-pointer hover:bg-gray-200"
              :class="
                contactIsSelected(contact)
                  ? 'border-primary'
                  : 'border-gray-200'
              "
            >
              <span class="font-semibold">{{ contact.displayName }}</span>
              <span>{{ contact.email }}</span>
            </span>
          </div>
        </div>
        <div
          v-else
          class="flex justify-center font-semibold my-2 bg-gray-100 rounded border-gray-200 border py-5"
        >
          No Contacts!
        </div>
        <div v-if="contacts.length > 0" class="flex justify-between">
          <p class="mt-2">
            Total Invites
            <span
              class="ml-2 bg-primary text-white text-sm px-1 py-0.5 rounded"
              >{{ selectedContacts.length }}</span
            >
          </p>
          <text-link
            v-if="selectedContacts.length !== contacts.length"
            @click="selectAll"
            >Select All</text-link
          >
          <text-link v-else @click="selectedContacts = []">Clear</text-link>
        </div>
      </div>
      <notification-reminder-section
        :existing-data="form"
        @update="form = $event"
        @error="datesError = $event"
      ></notification-reminder-section>
    </div>
    <div class="w-full flex py-10 flex justify-between">
      <button-icon bg-colour="gray" @click="cancel"
        ><template v-slot:icon><i class="fas fa-times fa-fw"></i></template
        >Cancel</button-icon
      >
      <button-icon :disabled="!isValid" @click="sendInvites"
        ><template v-slot:icon
          ><i class="fas fa-paper-plane fa-fw"></i></template
        >Send Invites</button-icon
      >
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import moment from 'moment'
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import ButtonIcon from '~/components/elements/ButtonIcon'
import NotificationReminderSection from '~/components/surveys/NotificationReminderSection'
import InputBaseWithButton from '~/components/elements/InputBaseWithButton'
import ButtonForInput from '~/components/elements/ButtonForInput'
import Spinner from '~/components/layouts/Spinner'
import TextLink from '~/components/elements/TextLink'

export default {
  name: 'InviteByContacts',
  components: {
    Spinner,
    ButtonForInput,
    InputBaseWithButton,
    NotificationReminderSection,
    ButtonIcon,
    TextLink,
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
      return parseSurveyToForm(this.survey)
    },
    contactList() {
      return this.$store.state.selectedContactList
    },
    originalContacts() {
      return this.$store.getters
        .getItems('contacts')
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
    this.$store
      .dispatch('contacts/getContacts', {
        limit: 1000,
        offset: 0,
      })
      .then(() => {
        this.form = JSON.parse(JSON.stringify(this.parsedSurvey))
        this.loading = false
      })
  },
  methods: {
    cancel() {
      this.$store.dispatch('setCurrentItemToBeEdited', null)
    },
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
      return moment().diff(moment(dob), 'y')
    },
    sendInvites() {
      const list = {
        surveyCode: this.survey.code,
        filter: null,
        notificationTimestamp: this.notificationTimestamp,
        notificationMessage: this.form.notificationMessage,
        reminderTimestamp: this.reminderTimestamp,
        reminderMessage: this.form.reminderMessage,
        invites: this.selectedContacts.map((el) => {
          return {
            email: el.email,
            filterData: {
              contactBookCode: this.contactList.code,
              contactCode: el.code,
              gender: el.gender ? el.gender : null,
              age: el.dob ? this.calculateAge(el.dob) : null,
            },
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
