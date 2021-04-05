<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
      <text-area-base v-model="contacts" class="input text-area">
        <span class="flex items-center">
          Invites
          <p class="italic text-sm ml-2 text-gray-600">
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

      <div class="flex w-full">
        <div class="w-9/12 pr-5">
          <input-base
            v-model="form.notificationDate"
            :error="
              $v.form.notificationDate.$model !== undefined
                ? !$v.form.notificationDate.required
                  ? 'required'
                  : null
                : null
            "
            type="date"
            @change="
              $v.form.notificationDate.$touch()
              $v.form.reminderDate.$touch()
            "
          >
            <template v-slot:default>
              <span class="flex items-center">
                Notification Date
                <popup-base class="ml-1"
                  ><template v-slot:text>
                    <span class="font-normal"
                      >This is date when notifications will be sent to
                      invitees.</span
                    ></template
                  ></popup-base
                ></span
              >
            </template></input-base
          >
        </div>
        <div class="w-3/12">
          <input-base
            v-model="form.notificationTime"
            :error="
              $v.form.notificationTime.$model !== undefined
                ? !$v.form.notificationTime.required
                  ? 'required'
                  : null
                : null
            "
            type="time"
            @change="$v.form.notificationTime.$touch()"
            ><span class="flex items-center"
              >Notification Time<popup-base
                class="invisible"
              ></popup-base></span
          ></input-base>
        </div>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold mb-2">Notification Message</label>
        <text-editor
          :content="form.notificationMessage"
          @updateContent="form.notificationMessage = $event"
        ></text-editor>
      </div>

      <div class="flex w-full">
        <div class="w-9/12 pr-5">
          <input-base
            v-model="form.reminderDate"
            :error="
              $v.form.reminderDate.$model !== undefined
                ? !$v.form.reminderDate.checkDates
                  ? 'this date must be after the valid from date'
                  : null
                : $v.form.reminderTime.$model !== undefined &&
                  !$v.form.reminderTime.dateRequiredIfTime
                ? 'required'
                : null
            "
            type="date"
            @change="$v.form.reminderDate.$touch()"
          >
            <template v-slot:default>
              <span class="flex items-center">
                Reminder Date
                <popup-base class="ml-1 font-normal"
                  >This is date when a reminder will be set to invitees who did
                  not complete the survey</popup-base
                ></span
              >
            </template></input-base
          >
        </div>
        <div class="w-3/12">
          <input-base
            v-model="form.reminderTime"
            :error="
              $v.form.reminderTime.$model !== undefined
                ? !$v.form.reminderTime.checkDates
                  ? 'this date must be after the valid from date'
                  : null
                : $v.form.reminderDate.$model !== undefined &&
                  !$v.form.reminderDate.timeRequiredIfDate
                ? 'required'
                : null
            "
            type="time"
            @change="$v.form.reminderTime.$touch()"
            ><span class="flex items-center"
              >Reminder Time<popup-base class="invisible"></popup-base></span
          ></input-base>
        </div>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold mb-2">Reminder Message</label>
        <text-editor
          :content="form.reminderMessage"
          @updateContent="form.reminderMessage = $event"
        ></text-editor>
      </div>
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
import moment from 'moment'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import { createMomentFromDateAndTime } from '~/helpers/helpers'
import ButtonIcon from '~/components/elements/ButtonIcon'
import TextEditor from '~/components/layouts/textEditor'
import TextAreaBase from '~/components/elements/TextAreaBase'
import InputBase from '~/components/elements/InputBase'
import PopupBase from '~/components/elements/PopupBase'

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
  components: {
    TextAreaBase,
    TextEditor,
    ButtonIcon,
    InputBase,
    PopupBase,
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
