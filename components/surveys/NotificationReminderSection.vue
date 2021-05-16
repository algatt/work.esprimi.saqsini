<template>
  <div class="flex flex-col space-y-5">
    <div v-if="form" class="flex flex-wrap w-full">
      <div class="w-full md:w-9/12 md:pr-3">
        <l-input
          v-model="form.notificationDate"
          :error="
            $v.form.notificationDate.$model !== undefined
              ? !$v.form.notificationDate.required
                ? 'required'
                : null
              : null
          "
          type="date"
          @update="
            $v.form.notificationDate.$touch()
            $v.form.notificationTime.$touch()
            $v.form.reminderDate.$touch()
            $v.form.reminderTime.$touch()
            form.notificationTime = form.notificationTime
              ? form.notificationTime
              : '08:00'
          "
        >
          <span class="flex items-center">
            Notification Date
            <popup-information
              >This is date when notifications will be sent to
              invitees.</popup-information
            ></span
          >
        </l-input>
      </div>
      <div class="w-full md:w-3/12">
        <l-input
          v-model="form.notificationTime"
          :error="
            $v.form.notificationTime.$model !== undefined
              ? !$v.form.notificationTime.required
                ? 'required'
                : null
              : null
          "
          type="time"
          @update="$v.form.notificationTime.$touch()"
          ><span class="flex items-center"
            >Notification Time<popup-information
              class="invisible"
            ></popup-information></span
        ></l-input>
      </div>
    </div>

    <div class="flex flex-col">
      <label class="font-semibold mb-2">Notification Message</label>
      <text-editor
        :enable-email-fields="canUseContactBook"
        :content="form.notificationMessage"
        @updateContent="form.notificationMessage = $event"
      ></text-editor>
    </div>

    <div class="flex w-full flex-wrap">
      <div class="w-full md:w-9/12 md:pr-3">
        <l-input
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
          @update="$v.form.reminderDate.$touch()"
        >
          <span class="flex items-center">
            Reminder Date
            <popup-information
              >This is date when a reminder will be set to invitees who did not
              complete the survey</popup-information
            ></span
          >
        </l-input>
      </div>
      <div class="w-full md:w-3/12">
        <l-input
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
          @update="$v.form.reminderTime.$touch()"
          ><span class="flex items-center"
            >Reminder Time<popup-information
              class="invisible"
            ></popup-information></span
        ></l-input>
      </div>
    </div>

    <div class="flex flex-col">
      <label class="font-semibold mb-2">Reminder Message</label>
      <text-editor
        :enable-email-fields="canUseContactBook"
        :content="form.reminderMessage"
        @updateContent="form.reminderMessage = $event"
      ></text-editor>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { DateTime } from 'luxon'
import TextEditor from '~/components/elements/textEditor'
import { isDateBefore } from '~/services/date-helpers'

const checkDates = (value, vm) => {
  if (
    vm.reminderDate === '' ||
    vm.reminderDate === undefined ||
    vm.reminderTime === '' ||
    vm.reminderTime === undefined
  )
    return true

  return isDateBefore(
    `${vm.notificationDate}T${vm.notificationTime}`,
    `${vm.reminderDate}T${vm.reminderTime}`
  )
}

export default {
  name: 'NotificationReminderSection',
  components: { TextEditor },
  mixins: [validationMixin],
  props: {
    existingData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: null,
    }
  },
  computed: {
    canUseContactBook() {
      return this.$store.getters['auth/getPermissions'].includes('CONTACTBOOK')
    },
    notificationTimestamp() {
      if (this.form.notificationDate && this.form.notificationTime) {
        return DateTime.fromISO(
          `${this.form.notificationDate}T${this.form.notificationTime}`
        ).toFormat('yyyy-MM-dd hh:mm:ssZZZ')
      }
      return null
    },
    reminderTimestamp() {
      if (this.form.reminderDate && this.form.reminderTime) {
        return DateTime.fromISO(
          `${this.form.reminderDate}T${this.form.reminderTime}`
        ).toFormat('yyyy-MM-dd hh:mm:ssZZZ')
      }
      return null
    },
  },
  watch: {
    form: {
      handler(ev) {
        this.form.notificationTimestamp = this.notificationTimestamp
        this.form.reminderTimestamp = this.reminderTimestamp
        this.$emit('update', this.form)
        this.$emit('error', this.$v.$invalid)
      },
      deep: true,
    },
  },
  validations: {
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
  created() {
    this.form = JSON.parse(JSON.stringify(this.existingData))
  },
}
</script>

<style scoped></style>
