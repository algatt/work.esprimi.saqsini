<template>
  <div class="flex flex-col mt-5 space-y-8">
    <div class="flex flex-col space-y-3">
      <l-text-area
        v-model="contacts"
        class="input text-area"
        @input="contacts = contacts.toLowerCase()"
      >
        <span class="flex items-center">
          <span class="mr-2">Invites</span>
          <popup-information
            >You can enter a list of emails separated by a
            semicolon.</popup-information
          >
        </span>
      </l-text-area>
      <div class="flex items-center justify-start space-x-2">
        <p>Total Invites</p>
        <l-badge> {{ validTotalInvites }}</l-badge>

        <l-badge
          v-for="(item, index) in $v.totalInvites.$each.$iter"
          :key="index"
          :color="item.$invalid ? (!item.email ? 'red' : 'yellow') : 'green'"
        >
          {{ item.$model }}</l-badge
        >
      </div>
    </div>

    <notification-reminder-section
      :existing-data="form"
      @update="form = $event"
      @error="datesError = $event"
    ></notification-reminder-section>

    <div class="w-full flex py-10 flex justify-center">
      <l-button :disabled="!isValid" @click="sendInvites"
        >Send Invites<template v-slot:rightIcon
          ><i class="fas fa-paper-plane fa-fw"></i></template
      ></l-button>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email } from 'vuelidate/lib/validators'
import { convertSurveyFromApiToForm } from '@/services/survey-helpers'
import NotificationReminderSection from '@/components/surveys/NotificationReminderSection'

export default {
  name: 'InviteByEmail',
  components: {
    NotificationReminderSection,
  },
  mixins: [validationMixin],
  props: {
    survey: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {},
      contacts: '',
      datesError: false,
    }
  },
  validations: {
    totalInvites: {
      $each: {
        email,
        duplicate(value) {
          return (
            this.totalInvites.filter((el) => {
              return el === value.trim().toLowerCase()
            }).length < 2
          )
        },
      },
    },
  },
  computed: {
    isValid() {
      return !this.datesError && this.totalInvites.length > 0
    },
    parsedSurvey() {
      return convertSurveyFromApiToForm(this.survey)
    },
    totalInvites() {
      const temp = this.contacts
        .split(';')
        .map(function (item) {
          return item.trim()
        })
        .filter((el) => {
          return el.length !== 0
        })
      if (temp.length === 1 && temp[0] === '') return []
      return temp
    },
    validTotalInvites() {
      const obj = this.$v.totalInvites.$each.$iter
      let x = 0
      Object.keys(obj).forEach((el) => {
        if (!obj[el].$invalid) x++
      })
      return x
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.parsedSurvey))
  },
  methods: {
    sendInvites() {
      const list = {
        surveyCode: this.survey.code,
        filter: null,
        notificationTimestamp: this.form.notificationTimestamp,
        notificationMessage: this.form.notificationMessage,
        reminderTimestamp: this.form.reminderTimestamp,
        reminderMessage: this.form.reminderMessage,
        invites: this.totalInvites.map((el) => {
          return { email: el }
        }),
      }

      this.$store
        .dispatch('invitations/add', list)
        .then(() => {
          this.$toasted.show('Invitations successfully sent')
          this.$store.dispatch('invitations/getAll', { code: this.survey.code })
        })
        .catch(() => {
          this.$toasted.show('There was a problem sending the invitations')
        })
    },
  },
}
</script>

<style scoped></style>
