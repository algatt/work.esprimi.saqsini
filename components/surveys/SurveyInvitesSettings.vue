<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col space-y-5">
      <div class="flex flex-wrap w-full">
        <div class="w-full xl:w-9/12 xl:pr-5 mb-2 xl:mb-0">
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
        <div class="w-full xl:w-3/12">
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
        <label class="font-semibold mb-1">Notification Message</label>

        <text-editor
          :content="form.notificationMessage"
          :enable-email-fields="contactList !== null"
          @updateContent="form.notificationMessage = $event"
        ></text-editor>
      </div>

      <div class="flex flex-wrap w-full">
        <div class="w-full xl:w-9/12 xl:pr-5 mb-2 xl:mb-0">
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
        <div class="w-full xl:w-3/12">
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
        <label class="label">Reminder Message</label>
        <text-editor
          :content="form.reminderMessage"
          :enable-email-fields="contactList !== null"
          @updateContent="form.reminderMessage = $event"
        ></text-editor>
      </div>
    </div>

    <edit-object-modal-bottom-part
      :form="form"
      which="surveys"
      :is-valid="true"
      :show-delete="false"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'

import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
import { createMomentFromDateAndTime } from '~/helpers/helpers'
import TextEditor from '~/components/layouts/textEditor'

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
  name: 'SurveyInvitesSettings',
  components: {
    TextEditor,
    EditObjectModalBottomPart,

    PopupBase,
  },
  mixins: [validationMixin],
  data() {
    return {
      form: {},
    }
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
  computed: {
    survey() {
      return this.$store.state.currentItemToBeEdited
    },
    contactList() {
      return this.$store.state.selectedContactList
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.survey))
  },
  methods: {
    activateInput(which) {
      document.getElementById(which).click()
    },
  },
}
</script>

<style scoped></style>
