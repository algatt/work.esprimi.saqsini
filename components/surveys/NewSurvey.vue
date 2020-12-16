<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col">
      <label for="inputCategory" class="label">Category</label>
      <select
        id="inputCategory"
        v-model="form.categoryCode"
        class="input select"
        @change="form.subCategoryCode = subcategories[0].code"
      >
        <option
          v-for="category in categories"
          :key="category.code"
          :value="category.code"
        >
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="flex flex-col">
      <label for="inputSubcategory" class="label">Subcategory</label>
      <select
        id="inputSubcategory"
        v-model="form.subCategoryCode"
        class="input select"
      >
        <option
          v-for="subcategory in subcategories"
          :key="subcategory.code"
          :value="subcategory.code"
        >
          {{ subcategory.name }}
        </option>
      </select>
    </div>

    <div class="flex flex-col">
      <div class="flex items-center w-full">
        <label for="inputName" class="label">Name</label>
        <span v-if="$v.form.name.$error">
          <span v-if="!$v.form.name.required" class="error">required</span>
        </span>
      </div>

      <input
        id="inputName"
        v-model="form.name"
        placeholder="Enter survey name"
        class="input"
        @change="$v.form.name.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center w-full">
        <label for="inputText" class="label">Description</label
        ><span v-if="$v.form.text.$error">
          <span v-if="!$v.form.text.required" class="error"
            >required</span
          ></span
        >
      </div>

      <textarea
        id="inputText"
        v-model="form.text"
        placeholder="Enter survey description"
        class="input"
        @change="$v.form.text.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center w-full justify-between md:justify-start">
        <div class="flex items-center">
          <label for="inputReferenceDate" class="label">Reference Date</label>
          <span v-if="$v.form.referenceDate.$error">
            <span v-if="!$v.form.referenceDate.required" class="error"
              >required</span
            >
          </span>
        </div>
        <popup-info
          ><template v-slot:text
            >This date will tell you when your survey was created.</template
          ></popup-info
        >
      </div>

      <input
        id="inputReferenceDate"
        v-model="form.referenceDate"
        class="input w-full"
        type="date"
        @change="$v.form.referenceDate.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center w-full">
        <label for="inputValidFromDate" class="label">Valid From</label>
        <span
          v-if="$v.form.validFromDate.$error || $v.form.validFromTime.$error"
        >
          <span v-if="!$v.form.validFromDate.required" class="error"
            >date is required.</span
          >
          <span v-else-if="!$v.form.validFromTime.required" class="error"
            >time is required.</span
          >
          <span v-else>&nbsp;</span>
        </span>
        <popup-info
          ><template v-slot:text
            >Responses will be allowed from this date.</template
          ></popup-info
        >
      </div>
      <div class="flex flex-wrap md:space-x-3 justify-between w-full">
        <input
          id="inputValidFromDate"
          v-model="form.validFromDate"
          class="input w-8/12"
          type="date"
          @change="
            $v.form.validFromDate.$touch()
            $v.form.validToDate.$touch
          "
        />
        <input
          id="inputValidFromTime"
          v-model="form.validFromTime"
          class="input w-3/12"
          type="time"
          @change="$v.form.validFromTime.$touch()"
        />
      </div>
    </div>

    <div class="flex flex-col">
      <div class="flex items-center w-full">
        <label for="inputValidToDate" class="label-optional">Valid To</label>
        <span v-if="$v.form.validToTime.$error || $v.form.validToDate.$error">
          <span v-if="!$v.form.validToTime.dateRequiredIfTime" class="error"
            >date must be filled in</span
          >
          <span
            v-else-if="!$v.form.validToDate.timeRequiredIfDate"
            class="error"
            >time must be filled in</span
          >
          <span v-else-if="!$v.form.validFromDate.checkDates" class="error">
            this date must be after the from date
          </span>
        </span>
        <popup-info
          ><template v-slot:text
            >If this is set, responses will be not be accepted after this
            date.</template
          ></popup-info
        >
      </div>

      <div class="flex flex-wrap space-x-3 md:space-x-3 justify-between w-full">
        <input
          id="inputValidToDate"
          v-model="form.validToDate"
          class="input w-8/12"
          type="date"
          @change="$v.form.validToDate.$touch()"
        />
        <input
          id="inputValidToTime"
          v-model="form.validToTime"
          class="input w-3/12"
          type="time"
          @change="$v.form.validToTime.$touch()"
        />
      </div>
    </div>

    <edit-object-modal-bottom-part
      :form="form"
      which="surveys"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'

import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
import { createMomentFromDateAndTime } from '~/helpers/helpers'
import PopupInfo from '~/components/layouts/PopupInfo'

const checkDates = (value, vm) => {
  if (
    vm.validToDate === '' ||
    vm.validToDate === undefined ||
    vm.validToTime === '' ||
    vm.validToTime === undefined
  )
    return true

  const dateStart = createMomentFromDateAndTime(
    vm.validFromDate,
    vm.validFromTime
  )
  const dateEnd = createMomentFromDateAndTime(vm.validToDate, vm.validToTime)

  return moment(dateEnd).isAfter(moment(dateStart))
}

export default {
  name: 'NewSurvey',
  components: { PopupInfo, EditObjectModalBottomPart },
  mixins: [validationMixin],
  props: {
    selectedCategoryCode: {
      type: Number,
      required: false,
      default: -1,
    },
    selectedSubcategoryCode: {
      type: Number,
      required: false,
      default: -1,
    },
  },
  validations: {
    form: {
      name: {
        required,
      },
      text: {
        required,
      },
      referenceDate: {
        required,
      },
      validFromDate: {
        required,
        checkDates,
      },
      validFromTime: {
        required,
        checkDates,
      },
      validToDate: {
        timeRequiredIfDate(value) {
          if (value === '' || value === undefined) return true
          return (
            this.form.validToTime !== '' && this.form.validToTime !== undefined
          )
        },
        checkDates,
      },
      validToTime: {
        dateRequiredIfTime(value) {
          if (value === '' || value === undefined) return true
          return (
            this.form.validToDate !== '' && this.form.validToDate !== undefined
          )
        },
        checkDates,
      },
    },
  },
  data() {
    return {
      form: null,
    }
  },
  computed: {
    isValid() {
      return !this.$v.$invalid
    },
    item() {
      return this.$store.state.currentItemToBeEdited
    },
    categories() {
      let x = JSON.parse(
        JSON.stringify(this.$store.getters.getItems('categories'))
      )

      let allSubcategories = this.$store.getters.getItems('subcategories')
      allSubcategories = allSubcategories.map((el) => {
        return el.categoryCode
      })

      x = x.filter((el) => {
        return allSubcategories.includes(el.code)
      })

      return x.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    subcategories() {
      let x = JSON.parse(
        JSON.stringify(this.$store.getters.getItems('subcategories'))
      )
      if (this.form.categoryCode)
        x = x.filter((el) => {
          return el.categoryCode === this.form.categoryCode
        })
      return x.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.item))
    if (this.form.subCategoryCode) {
      const getSubcategory = this.subcategories.find((el) => {
        return Number(el.code) === Number(this.form.subCategoryCode)
      })
      this.form.categoryCode = getSubcategory.categoryCode
    } else if (this.selectedSubcategoryCode) {
      this.form.categoryCode = this.selectedCategoryCode
      this.form.subCategoryCode = this.selectedSubcategoryCode
    } else if (
      Number(this.selectedCategoryCode) === -1 ||
      (Number(this.selectedCategoryCode) !== -1 &&
        this.selectedSubcategoryCode === null)
    ) {
      this.form.categoryCode = this.categories[0].code
      this.form.subCategoryCode = this.subcategories[0].code
    }

    this.form = parseSurveyToForm(this.form)
  },
  mounted() {
    document.getElementById('inputName').focus()
  },
}
</script>
