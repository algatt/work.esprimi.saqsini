<template>
  <div class="flex flex-col space-y-5">
    <div class="flex flex-wrap w-full">
      <div class="w-full xl:w-9/12 xl:pr-5 mb-2 xl:mb-0">
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
          @change="
            $v.form.notificationDate.$touch()
            $v.form.notificationTime.$touch()
            $v.form.reminderDate.$touch()
            $v.form.reminderTime.$touch()
            form.notificationTime = form.notificationTime
              ? form.notificationTime
              : '08:00'
          "
        >
          <template v-slot:default>
            <span class="flex items-center">
              Notification Date
              <popup-information class="ml-1"
                >This is date when notifications will be sent to
                invitees.</popup-information
              ></span
            >
          </template></l-input
        >
      </div>
      <div class="w-full xl:w-3/12">
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
          @change="$v.form.notificationTime.$touch()"
          ><span class="flex items-center"
            >Notification Time<popup-information
              class="invisible"
            ></popup-information></span
        ></l-input>
      </div>
    </div>

    <div class="flex flex-col">
      <label class="font-semibold mb-1">Notification Message</label>

      <text-editor
        :content="form.notificationMessage"
        @updateContent="form.notificationMessage = $event"
      ></text-editor>
    </div>

    <div class="flex flex-wrap w-full">
      <div class="w-full xl:w-9/12 xl:pr-5 mb-2 xl:mb-0">
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
          @change="$v.form.reminderDate.$touch()"
        >
          <template v-slot:default>
            <span class="flex items-center">
              Reminder Date
              <popup-information class="ml-1"
                >This is date when a reminder will be set to invitees who did
                not complete the survey</popup-information
              ></span
            >
          </template></l-input
        >
      </div>
      <div class="w-full xl:w-3/12">
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
          @change="$v.form.reminderTime.$touch()"
          ><span class="flex items-center"
            >Reminder Time<popup-information
              class="invisible"
            ></popup-information></span
        ></l-input>
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
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import TextEditor from '~/components/layouts/textEditor'
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
  name: 'SurveyInvitesSettings',
  components: {
    TextEditor,
  },
  mixins: [validationMixin],
  props: {
    dataItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {},
    }
  },
  watch: {
    form: {
      handler() {
        this.$emit('update', this.form)
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
    this.form = JSON.parse(JSON.stringify(this.dataItem))
  },
  methods: {
    activateInput(which) {
      document.getElementById(which).click()
    },
  },
}
</script>

<style scoped></style>
