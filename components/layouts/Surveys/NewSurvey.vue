<template>
  <div class="flex flex-col space-y-7 w-full">
    <l-select v-model="form.categoryCode" @input="changedCategory">
      Category
      <template v-slot:options>
        <option
          v-for="category in categories"
          :key="category.code"
          :value="category.code"
        >
          {{ category.name }}
        </option></template
      >
    </l-select>

    <l-select v-model="form.subCategoryCode" :disabled="!form.categoryCode">
      Subcategory
      <template v-slot:options>
        <option
          v-for="subcategory in subcategories"
          :key="subcategory.code"
          :value="subcategory.code"
        >
          {{ subcategory.name }}
        </option></template
      >
    </l-select>

    <l-input
      id="inputName"
      v-model="form.name"
      :error="
        $v.form.name.$model !== undefined
          ? !$v.form.name.required
            ? 'required'
            : null
          : null
      "
      @input="$v.form.name.$touch()"
      >Survey Name</l-input
    >

    <l-text-area
      v-model="form.textConverted"
      :error="
        $v.form.textConverted.$model !== undefined &&
        !$v.form.textConverted.required
          ? 'required'
          : null
      "
      @input="$v.form.textConverted.$touch()"
      >Survey Description</l-text-area
    >

    <l-input
      v-model="form.referenceDate"
      type="date"
      :error="
        $v.form.referenceDate.$model !== undefined &&
        !$v.form.referenceDate.required
          ? 'required'
          : null
      "
    >
      <template v-slot:default>
        <span class="flex items-center">
          Reference Date
          <popup-information>
            This date will tell you when your survey was
            created</popup-information
          ></span
        >
      </template>
    </l-input>

    <div class="flex flex-wrap w-full">
      <div class="w-full xl:w-9/12 xl:pr-5 mb-2 xl:mb-0">
        <l-input
          v-model="form.validFromDate"
          :error="
            $v.form.validFromDate.$model !== undefined &&
            !$v.form.validFromDate.required
              ? 'required'
              : null
          "
          type="date"
          @change="
            $v.form.validFromDate.$touch()
            $v.form.validFromTime.$touch()
            $v.form.validToDate.$touch()
            $v.form.validToTime.$touch()
            form.validFromTime = form.validFromTime
              ? form.validFromTime
              : '08:00'
          "
        >
          <template v-slot:default>
            <span class="flex items-center">
              Valid From Date
              <popup-information
                >This date will open the survey for responses</popup-information
              ></span
            >
          </template></l-input
        >
      </div>
      <div class="w-full xl:w-3/12">
        <l-input
          v-model="form.validFromTime"
          :error="
            $v.form.validFromDate.$model !== undefined &&
            !$v.form.validFromTime.required
              ? 'required'
              : null
          "
          type="time"
          @change="$v.form.validFromTime.$touch()"
          ><span class="flex items-center"
            >Valid From Time<popup-information
              class="invisible"
            ></popup-information></span
        ></l-input>
      </div>
    </div>

    <div class="flex flex-wrap w-full">
      <div class="w-full xl:w-9/12 xl:pr-5 mb-2 xl:mb-0">
        <l-input
          v-model="form.validToDate"
          :error="
            $v.form.validToDate.$model !== undefined &&
            !$v.form.validToDate.checkDates
              ? 'this date must be after the valid from date'
              : $v.form.validToTime.$model !== undefined &&
                !$v.form.validToTime.dateRequiredIfTime
              ? 'required'
              : null
          "
          type="date"
          @change="
            $v.form.validToDate.$touch()
            form.validToTime = form.validToTime ? form.validToTime : '08:00'
          "
        >
          <template v-slot:default>
            <span class="flex items-center">
              Valid To Date
              <popup-information class="ml-1 font-normal"
                >This date will close the survey for any future
                responses</popup-information
              ></span
            >
          </template></l-input
        >
      </div>
      <div class="w-full xl:w-3/12">
        <l-input
          v-model="form.validToTime"
          :error="
            $v.form.validToTime.$model !== undefined &&
            !$v.form.validToTime.checkDates
              ? 'this date must be after the valid from date'
              : $v.form.validToDate.$model !== undefined &&
                !$v.form.validToDate.timeRequiredIfDate
              ? 'required'
              : null
          "
          type="time"
          @change="$v.form.validToTime.$touch()"
          ><span class="flex items-center"
            >Valid To Time<popup-information
              class="invisible"
            ></popup-information></span
        ></l-input>
      </div>
    </div>
  </div>
</template>

<script>
import { convertSurveyFromApiToForm } from '@/services/survey-helpers'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { isDateBefore } from '@/services/date-helpers'
import { DateTime } from 'luxon'

const checkDates = (value, vm) => {
  if (
    vm.validToDate === '' ||
    vm.validToDate === undefined ||
    vm.validToTime === '' ||
    vm.validToTime === undefined
  )
    return true

  return isDateBefore(
    `${vm.validFromDate}T${vm.validFromTime}`,
    `${vm.validToDate}T${vm.validToTime}`
  )
}

export default {
  name: 'NewSurvey',

  mixins: [validationMixin],
  props: {
    dataItem: {
      type: Object,
      required: true,
    },
  },
  validations: {
    form: {
      name: {
        required,
      },
      textConverted: {
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
    categories() {
      let x = JSON.parse(
        JSON.stringify(this.$store.state.categories.categories)
      )

      let allSubcategories = this.$store.state.categories.subcategories
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
        JSON.stringify(this.$store.state.categories.subcategories)
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

  watch: {
    form: {
      handler(value) {
        this.$emit('update', value)
      },
      deep: true,
    },
  },
  created() {
    this.form = convertSurveyFromApiToForm(this.dataItem)
    if (!this.form.referenceDate)
      this.form.referenceDate = DateTime.now().toISODate()

    if (!this.form.validFromDate) {
      this.form.validFromDate = DateTime.now().toISODate()
      this.form.validFromTime = '08:00'
    }
  },
  mounted() {
    // document.getElementById('inputName').focus()
    this.$watch(
      '$v',
      (val) => {
        if (typeof val !== 'undefined') {
          this.$emit('valid', !this.$v.$invalid)
        }
      },
      { deep: true, immediate: true }
    )
  },
  methods: {
    changedCategory() {
      delete this.form.subCategoryCode
      if (this.subcategories.length > 0)
        this.form.subCategoryCode = this.subcategories[0].code
    },
  },
}
</script>
