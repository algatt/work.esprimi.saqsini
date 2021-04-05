<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-2">
      <select-base
        v-model="form.categoryCode"
        @input="form.subCategoryCode = subcategories[0].code"
      >
        Category
        <template v-slot:options>
          <option
            v-for="category in categories"
            :key="category.code"
            :value="category.code"
            :selected="category.code === form.categoryCode"
          >
            {{ category.name }}
          </option></template
        >
      </select-base>

      <select-base v-model="form.subCategoryCode">
        Subcategory
        <template v-slot:options>
          <option
            v-for="subcategory in subcategories"
            :key="subcategory.code"
            :value="subcategory.code"
            :selected="subcategory.code === form.subCategoryCode"
          >
            {{ subcategory.name }}
          </option></template
        >
      </select-base>

      <input-base
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
        >Survey Name</input-base
      >

      <text-area-base
        v-model="form.text"
        :error="
          $v.form.text.$model !== undefined
            ? !$v.form.text.required
              ? 'required'
              : null
            : null
        "
        @input="$v.form.text.$touch()"
        >Survey Description</text-area-base
      >

      <input-base
        v-model="form.referenceDate"
        type="date"
        :error="
          $v.form.referenceDate.$model !== undefined
            ? !$v.form.referenceDate.required
              ? 'required'
              : null
            : null
        "
      >
        <template v-slot:default>
          <span class="flex items-center">
            Reference Date
            <popup-info
              ><template v-slot:text>
                <span class="font-normal"
                  >This date will tell you when your survey was created</span
                ></template
              ></popup-info
            ></span
          >
        </template>
      </input-base>

      <div class="flex w-full">
        <div class="w-9/12 pr-5">
          <input-base
            v-model="form.validFromDate"
            :error="
              $v.form.validFromDate.$model !== undefined
                ? !$v.form.validFromDate.required
                  ? 'required'
                  : null
                : null
            "
            type="date"
            @change="
              $v.form.validFromDate.$touch()
              $v.form.validToDate.$touch()
            "
          >
            <template v-slot:default>
              <span class="flex items-center">
                Valid From Date
                <popup-info
                  ><template v-slot:text>
                    <span class="font-normal"
                      >This date will open the survey for responses</span
                    ></template
                  ></popup-info
                ></span
              >
            </template></input-base
          >
        </div>
        <div class="w-3/12">
          <input-base
            v-model="form.validFromTime"
            :error="
              $v.form.validFromTime.$model !== undefined
                ? !$v.form.validFromTime.required
                  ? 'required'
                  : null
                : null
            "
            type="time"
            @change="$v.form.validFromTime.$touch()"
            >Valid From Time</input-base
          >
        </div>
      </div>

      <div class="flex w-full">
        <div class="w-9/12 pr-5">
          <input-base
            v-model="form.validToDate"
            :error="
              $v.form.validToDate.$model !== undefined
                ? !$v.form.validToDate.checkDates
                  ? 'this date must be after the valid from date'
                  : null
                : $v.form.validToTime.$model !== undefined &&
                  !$v.form.validToTime.dateRequiredIfTime
                ? 'required'
                : null
            "
            type="date"
            @change="$v.form.validToDate.$touch()"
          >
            <template v-slot:default>
              <span class="flex items-center">
                Valid To Date
                <popup-info
                  ><template v-slot:text>
                    <span class="font-normal"
                      >This date will close the survey for any future
                      responses</span
                    ></template
                  ></popup-info
                ></span
              >
            </template></input-base
          >
        </div>
        <div class="w-3/12">
          <input-base
            v-model="form.validToTime"
            :error="
              $v.form.validToTime.$model !== undefined
                ? !$v.form.validToTime.checkDates
                  ? 'this date must be after the valid from date'
                  : null
                : $v.form.validToDate.$model !== undefined &&
                  !$v.form.validToDate.timeRequiredIfDate
                ? 'required'
                : null
            "
            type="time"
            @change="$v.form.validToTime.$touch()"
            >Valid To Time</input-base
          >
        </div>
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
import SelectBase from '~/components/elements/SelectBase'
import InputBase from '~/components/elements/InputBase'
import TextAreaBase from '~/components/elements/TextAreaBase'

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
  components: {
    TextAreaBase,
    InputBase,
    SelectBase,
    PopupInfo,
    EditObjectModalBottomPart,
  },
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
    const obj = document
      .getElementById('inputName')
      .getElementsByTagName('input')[0]
    obj.focus()
  },
}
</script>
