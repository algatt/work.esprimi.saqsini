<template>
  <div class="flex flex-col w-full">
    <div class="w-full flex items-center mb-5">
      <menu-icon-button
        :active="selectedSection === 'details'"
        @click="selectSection('details')"
      >
        Details
        <template v-slot:icon
          ><i class="fas fa-question-circle fa-fw"></i
        ></template>
      </menu-icon-button>
      <menu-icon-button
        :active="selectedSection === 'customisation'"
        @click="selectSection('customisation')"
      >
        Details
        <template v-slot:icon><i class="fas fa-sliders-h fa-fw"></i></template>
      </menu-icon-button>
    </div>
    <div
      v-if="selectedSection === 'details'"
      class="flex flex-col space-y-7 w-full"
    >
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

      <l-text-area v-model="form.textConverted">Survey Description</l-text-area>

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
                  >This date will open the survey for
                  responses</popup-information
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
            @change="$v.form.validToDate.$touch()"
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
    <div v-else class="flex flex-col space-y-7 w-full">
      <div class="flex flex-col">
        <label class="font-semibold mb-1">Header Image</label>
        <input
          id="inputHeaderImage"
          type="file"
          hidden
          @change="updateLogo('inputHeaderImage', 'headerImage')"
        />
        <div class="flex flex-col justify-start items-start">
          <button
            class="text-primary focus:outline-none hover:text-primary-darker w-36"
            style="min-height: 6rem"
            @click="activateInput('inputHeaderImage')"
          >
            <img
              v-if="form.options.headerImage"
              :src="form.options.headerImage"
              class="rounded bg-cover"
            />
            <i v-else class="far fa-image fa-fw fa-3x"></i>
          </button>
          <l-select
            v-if="form.options.headerImage"
            v-model="form.options.headerAlignment"
            class="my-2"
          >
            <template #default>Alignment</template>
            <template #options>
              <option value="mr-auto">Left</option>
              <option value="mx-auto">Center</option>
              <option value="ml-auto">Right</option>
            </template>
          </l-select>

          <l-text-link
            v-if="form.options.headerImage !== ''"
            class="btn-link my-1"
            @click="
              form.options.headerImage = ''
              headerImage = ''
            "
          >
            Clear
          </l-text-link>
        </div>
      </div>
      <div class="flex flex-col">
        <label class="font-semibold mb-1">Footer Image</label>
        <input
          id="inputFooterImage"
          type="file"
          hidden
          @change="updateLogo('inputFooterImage', 'footerImage')"
        />
        <div class="flex flex-col justify-start items-start">
          <button
            class="text-primary focus:outline-none hover:text-primary-darker w-36"
            style="min-height: 6rem"
            @click="activateInput('inputFooterImage')"
          >
            <img
              v-if="form.options.footerImage"
              :src="form.options.footerImage"
              class="rounded bg-cover"
            />
            <i v-else class="far fa-image fa-fw fa-3x"></i>
          </button>
          <l-select
            v-if="form.options.footerImage"
            v-model="form.options.footerAlignment"
            class="my-2"
          >
            <template #default>Alignment</template>
            <template #options>
              <option value="mr-auto">Left</option>
              <option value="mx-auto">Center</option>
              <option value="ml-auto">Right</option>
            </template>
          </l-select>
          <l-text-link
            v-if="form.options.footerImage !== ''"
            class="btn-link my-1"
            @click="
              form.options.footerImage = ''
              headerImage = ''
            "
          >
            Clear
          </l-text-link>
        </div>
      </div>

      <div class="flex flex-col">
        <label class="font-semibold mb-2">Theme Colour</label>
        <div class="flex space-x-2">
          <button
            v-for="(theme, index) in themeColours"
            :key="index"
            class="h-8 w-8 rounded-full border-2 border-gray-300 hover:border-gray-500 focus:outline-none"
            :class="theme.accentBackground"
            @click="
              form.options.theme = theme
              $forceUpdate()
            "
          >
            <i
              v-if="
                form.options.theme && theme.name === form.options.theme.name
              "
              class="fas fa-check fa-fw fa-sm text-white"
            ></i>
          </button>
        </div>
      </div>
      <div v-if="form.flags.includes('KIOSK')" class="w-full">
        <l-input v-model="form.options.redirectURL">
          <template>
            <span class="flex items-center"
              >Redirection URL
              <popup-information
                >When in Kiosk mode, after a survey is submitted, the page will
                refresh to allow for a new submission. If a URL is entered, it
                will redirect to given URL.</popup-information
              ></span
            >
          </template>
        </l-input>
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
import MenuIconButton from '~/components/elements/MenuIconButton'
import {
  SURVEY_COLOURS,
  SURVEY_OPTIONS,
} from '~/assets/settings/survey-settings'

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
  components: { MenuIconButton },
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
      selectedSection: 'details',
      themeColours: SURVEY_COLOURS.themes,
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

    if (!this.form.options) this.form.options = SURVEY_OPTIONS
    if (!this.form.flags) this.form.flags = []
  },
  mounted() {
    document.getElementById('inputName').focus()
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
    selectSection(which) {
      this.selectedSection = which
    },
    activateInput(which) {
      document.getElementById(which).click()
    },
    updateLogo(whichElement, whichData) {
      const t = this
      this[whichData] = document.getElementById(whichElement).files[0]
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        function () {
          if (reader.result.includes('data:image'))
            t.form.options[whichData] = reader.result
          else t.form.options[whichData] = ''
          t.$forceUpdate()
        },
        false
      )

      if (this[whichData]) {
        reader.readAsDataURL(this[whichData])
        if (whichData === 'headerImage')
          this.form.options.headerAlignment = 'mr-auto'
        else this.form.options.footerAlignment = 'mr-auto'
      }
    },
  },
}
</script>
