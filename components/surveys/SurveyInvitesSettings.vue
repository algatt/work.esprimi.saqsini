<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
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
              $v.form.reminderDate.$touch
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
        <textarea
          v-model="form.notificationMessage"
          class="input text-area"
        ></textarea>
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
        <textarea
          v-model="form.reminderMessage"
          class="input text-area"
        ></textarea>
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
import PopupInfo from '~/components/layouts/PopupInfo'

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
  components: { EditObjectModalBottomPart, PopupInfo },
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
