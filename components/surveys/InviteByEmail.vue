<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
      <div class="flex items-center">
        <label class="label">Invites</label>
        <p class="italic text-sm ml-2 text-gray-600">
          You can enter a list of emails separated by a semicolon.
        </p>
      </div>

      <textarea v-model="contacts" class="input text-area"></textarea>
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
      <div class="flex flex-col">
        <div class="flex items-center w-full">
          <label for="notificationDate" class="label">Notification Date</label>
          <span
            v-if="
              $v.form.notificationDate.$error || $v.form.notificationTime.$error
            "
          >
            <span v-if="!$v.form.notificationDate.required" class="error"
              >date is required.</span
            >
            <span v-else-if="!$v.form.notificationTime.required" class="error"
              >time is required.</span
            >
            <span v-else>&nbsp;</span>
          </span>
          <popup-info
            ><template v-slot:text
              >A notification to fill in the survey will be sent on this
              date.</template
            ></popup-info
          >
        </div>
        <div class="flex flex-wrap md:space-x-3 justify-between w-full">
          <input
            id="notificationDate"
            v-model="form.notificationDate"
            class="input w-8/12"
            type="date"
            @change="
              $v.form.notificationDate.$touch()
              $v.form.reminderDate.$touch()
            "
          />
          <input
            id="notificationTime"
            v-model="form.notificationTime"
            class="input w-3/12"
            type="time"
            @change="$v.form.notificationTime.$touch()"
          />
        </div>
      </div>

      <div class="flex flex-col">
        <label class="label">Notification Message</label>
        <text-editor
          :content="form.notificationMessage"
          @updateContent="form.notificationMessage = $event"
        ></text-editor>
      </div>

      <div class="flex flex-col">
        <div class="flex items-center w-full">
          <label for="reminderDate" class="label-optional">Reminder Date</label>
          <span
            v-if="$v.form.reminderTime.$error || $v.form.reminderDate.$error"
          >
            <span v-if="!$v.form.reminderTime.dateRequiredIfTime" class="error"
              >date must be filled in</span
            >
            <span
              v-else-if="!$v.form.reminderDate.timeRequiredIfDate"
              class="error"
              >time must be filled in</span
            >
            <span
              v-else-if="!$v.form.notificationDate.checkDates"
              class="error"
            >
              this date must be after the from date
            </span>
          </span>
          <popup-info
            ><template v-slot:text
              >A reminder to fill in the survey will be sent on this date.
            </template></popup-info
          >
        </div>

        <div
          class="flex flex-wrap space-x-3 md:space-x-3 justify-between w-full"
        >
          <input
            id="reminderDate"
            v-model="form.reminderDate"
            class="input w-8/12"
            type="date"
            @change="$v.form.reminderDate.$touch()"
          />
          <input
            id="inputValidToTime"
            v-model="form.reminderTime"
            class="input w-3/12"
            type="time"
            @change="$v.form.reminderTime.$touch()"
          />
        </div>
      </div>

      <div class="flex flex-col">
        <label class="label">Reminder Message</label>
        <text-editor
          :content="form.reminderMessage"
          @updateContent="form.reminderMessage = $event"
        ></text-editor>
      </div>
    </div>
    <div class="w-full flex py-10 flex justify-between">
      <button-icon icon="fas fa-times" colour="secondary" @click="cancel"
        ><template v-slot:text>Cancel</template></button-icon
      >
      <button-icon
        icon="fas fa-paper-plane"
        :disabled="!isValid"
        @click="sendInvites"
        ><template v-slot:text>Send Invites</template></button-icon
      >
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import { createMomentFromDateAndTime } from '~/helpers/helpers'
import PopupInfo from '~/components/layouts/PopupInfo'
import ButtonIcon from '~/components/layouts/ButtonIcon'
import TextEditor from '~/components/layouts/textEditor'

const checkDates = (value, vm) => {
  if (
    vm.reminderDate === '' ||
    vm.reminderDate === undefined ||
    vm.reminderTime === '' ||
    vm.reminderTime === undefined
  )
    return true

  const dateStart = createMomentFromDateAndTime(
    vm.notificationDate,
    vm.notificationTime
  )
  const dateEnd = createMomentFromDateAndTime(vm.reminderDate, vm.reminderTime)

  return moment(dateEnd).isAfter(moment(dateStart))
}
export default {
  name: 'InviteByEmail',
  components: { TextEditor, ButtonIcon, PopupInfo },
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
    form: {
      notificationDate: {
        required,
        checkDates,
      },
      notificationTime: {
        required,
        checkDates,
      },
      reminderDate: {
        timeRequiredIfDate(value) {
          if (value === '' || value === undefined) return true
          return (
            this.form.reminderTime !== '' &&
            this.form.reminderTime !== undefined
          )
        },
        checkDates,
      },
      reminderTime: {
        dateRequiredIfTime(value) {
          if (value === '' || value === undefined) return true
          return (
            this.form.reminderDate !== '' &&
            this.form.reminderDate !== undefined
          )
        },
        checkDates,
      },
    },
  },
  computed: {
    isValid() {
      return !this.$v.$invalid && this.totalInvites.length > 0
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
    notificationTimestamp() {
      if (this.form.notificationDate && this.form.notificationTime) {
        const dateStringTo =
          this.form.notificationDate + ' ' + this.form.notificationTime
        return moment(dateStringTo).format('YYYY-MM-DD HH:mm:SSZZ')
      }
      return null
    },
    reminderTimestamp() {
      if (this.form.reminderDate && this.form.reminderTime) {
        const dateStringTo =
          this.form.reminderDate + ' ' + this.form.reminderTime
        return moment(dateStringTo).format('YYYY-MM-DD HH:mm:SSZZ')
      }
      return null
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
        invites: [
          this.totalInvites.map((el) => {
            return { email: el }
          }),
        ],
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
