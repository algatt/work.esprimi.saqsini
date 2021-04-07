<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
      <text-area-base v-model="contacts" class="input text-area">
        <span class="flex flex-col">
          Invites
          <p class="italic text-sm text-gray-600">
            You can enter a list of emails separated by a semicolon.
          </p>
        </span>
      </text-area-base>
      <div class="flex items-center">
        <p class="mr-2">
          Total Invites
          <span
            class="ml-2 bg-primary text-white text-sm px-1 py-0.5 rounded"
            >{{ validTotalInvites }}</span
          >
        </p>

        <span
          v-for="(item, index) in $v.totalInvites.$each.$iter"
          :key="index"
          class="rounded px-2 py-0.5 text-sm mr-2"
          :class="
            item.$invalid
              ? !item.email
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          "
        >
          {{ item.$model }}</span
        >
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
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email } from 'vuelidate/lib/validators'
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import ButtonIcon from '~/components/elements/ButtonIcon'
import TextAreaBase from '~/components/elements/TextAreaBase'
import NotificationReminderSection from '~/components/surveys/NotificationReminderSection'

export default {
  name: 'InviteByEmail',
  components: {
    NotificationReminderSection,
    TextAreaBase,
    ButtonIcon,
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
      return parseSurveyToForm(this.survey)
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
    cancel() {
      this.$store.dispatch('setCurrentItemToBeEdited', null)
    },
    sendInvites() {
      const list = {
        surveyCode: this.survey.code,
        filter: null,
        notificationTimestamp: this.notificationTimestamp,
        notificationMessage: this.form.notificationMessage,
        reminderTimestamp: this.reminderTimestamp,
        reminderMessage: this.form.reminderMessage,
        invites: this.totalInvites.map((el) => {
          return { email: el }
        }),
      }

      this.$store
        .dispatch('invitations/add', list)
        .then(() => {
          this.$toasted.show('Invitations successfully sent')
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
