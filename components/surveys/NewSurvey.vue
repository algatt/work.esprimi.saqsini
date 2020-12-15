<template>
  <div class="flex flex-col w-full md:w-10/12 pb-32">
    <label for="inputCategory" class="label-required">Category</label>
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
    <span>&nbsp;</span>

    <label for="inputSubcategory" class="label-required">Subcategory</label>
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
    <span>&nbsp;</span>

    <label for="inputName" class="label-required">Name</label>
    <input
      id="inputName"
      v-model="form.name"
      placeholder="Enter survey name"
      class="input"
      @change="$v.form.name.$touch()"
    />
    <span v-if="!$v.form.name.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.name.required" class="error"
        >The name is required.</span
      >
    </span>

    <label for="inputText" class="label-required">Description</label>
    <input
      id="inputText"
      v-model="form.text"
      placeholder="Enter survey name"
      class="input"
      @change="$v.form.text.$touch()"
    />
    <span v-if="!$v.form.text.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.text.required" class="error"
        >The name is required.</span
      >
    </span>

    <label for="inputReferenceDate" class="label-required"
      >Reference Date</label
    >
    <input
      id="inputReferenceDate"
      v-model="form.referenceDate"
      class="input"
      type="date"
      @change="$v.form.referenceDate.$touch()"
    />
    <span v-if="!$v.form.referenceDate.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.referenceDate.required" class="error"
        >The reference date is required.</span
      >
    </span>

    <label for="inputValidFromDate" class="label-required">Valid From</label>
    <div class="flex flex-wrap justify-between">
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

    <span v-if="!$v.form.validFromDate.$error && !$v.form.validFromTime.$error"
      >&nbsp;</span
    >
    <span v-else>
      <span v-if="!$v.form.validFromDate.required" class="error"
        >Date is required.</span
      >
      <span v-else-if="!$v.form.validFromTime.required" class="error"
        >Time is required.</span
      >
      <span v-else>&nbsp;</span>
    </span>

    <label for="inputValidToDate" class="label">Valid To</label>
    <div class="flex flex-wrap justify-between">
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
    <span v-if="!$v.form.validToTime.$error && !$v.form.validToDate.$error"
      >&nbsp;</span
    >
    <span v-else>
      <span v-if="!$v.form.validToTime.dateRequiredIfTime" class="error"
        >Date must be filled in.</span
      >
      <span v-else-if="!$v.form.validToDate.timeRequiredIfDate" class="error"
        >Time must be filled in.</span
      >
      <span v-else-if="!$v.form.validFromDate.checkDates" class="error">
        Valid to date must be after valid from date.
      </span>
    </span>

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
  components: { EditObjectModalBottomPart },
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

<style>
.input {
}
</style>
