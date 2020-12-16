<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col">
      <label for="inputSector" class="label">Sector</label>
      <select
        id="inputSector"
        v-model="sectorCode"
        class="input select"
        @change="form.industryCode = industries[0].code"
      >
        <option
          v-for="sector in sectors"
          :key="sector.code"
          :value="sector.code"
        >
          {{ sector.name }}
        </option>
      </select>
    </div>

    <div class="flex flex-col">
      <label for="inputIndustry" class="label-optional">Industry</label>
      <select
        id="inputIndustry"
        v-model="form.industryCode"
        class="input select"
      >
        <option
          v-for="industry in industries"
          :key="industry.code"
          :value="industry.code"
        >
          {{ industry.name }}
        </option>
      </select>
    </div>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputName" class="label">Name</label>
        <span v-if="$v.form.name.$error">
          <span v-if="!$v.form.name.required" class="error"
            >required</span
          ></span
        >
      </div>
      <input
        id="inputName"
        v-model="form.name"
        placeholder="Enter company name"
        class="input"
        @change="$v.form.name.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputAbbr" class="label">Abbreviation</label>
        <span v-if="$v.form.abbr.$error">
          <span v-if="!$v.form.abbr.required" class="error"
            >The name is required.</span
          >
        </span>
      </div>
      <input
        id="inputAbbr"
        v-model="form.abbr"
        placeholder="Enter abbreviation"
        class="input"
        @change="$v.form.abbr.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputSize" class="label">Company Size</label>
        <span v-if="$v.form.size.$error">
          <span v-if="!$v.form.size.numeric" class="error"
            >the company size must be a number</span
          >
        </span>
      </div>
      <input
        id="inputSize"
        v-model="form.size"
        placeholder="Enter company size"
        class="input"
        @change="$v.form.size.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <label for="inputLogo" class="label">Company Logo</label>
      <input id="inputLogo" type="file" hidden @change="updateLogo" />
      <div class="flex justify-start items-center">
        <button
          class="text-primary focus:outline-none hover:text-primary-darker h-24 w-24"
          @click="activateInput"
        >
          <img v-if="form.logo" :src="form.logo" class="rounded bg-cover" />
          <i v-else class="far fa-image fa-fw fa-3x"></i>
        </button>
      </div>
    </div>

    <edit-object-modal-bottom-part
      :form="form"
      which="companies"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, numeric } from 'vuelidate/lib/validators'

import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'

export default {
  name: 'NewCompany',
  components: { EditObjectModalBottomPart },
  mixins: [validationMixin],
  validations: {
    form: {
      name: {
        required,
      },
      abbr: {
        required,
      },
      size: {
        numeric,
      },
    },
  },
  props: {
    selectedSectorCode: {
      type: Number,
      required: false,
      default: -1,
    },
    selectedIndustryCode: {
      type: Number,
      required: false,
      default: -1,
    },
  },
  data() {
    return {
      form: null,
      sectorCode: null,
    }
  },
  computed: {
    isValid() {
      return !this.$v.$invalid
    },

    item() {
      return this.$store.state.currentItemToBeEdited
    },
    sectors() {
      let x = JSON.parse(
        JSON.stringify(this.$store.getters.getItems('sectors'))
      )

      let allIndustries = this.$store.getters.getItems('industries')
      allIndustries = allIndustries.map((el) => {
        return el.sectorCode
      })

      x = x.filter((el) => {
        return allIndustries.includes(el.code)
      })

      return x.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    industries() {
      let x = JSON.parse(
        JSON.stringify(this.$store.getters.getItems('industries'))
      )
      if (this.sectorCode)
        x = x.filter((el) => {
          return el.sectorCode === this.sectorCode
        })
      return x.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.item))

    if (this.form.industryCode) {
      const getIndustry = this.industries.find((el) => {
        return el.code === this.form.industryCode
      })
      this.sectorCode = getIndustry.sectorCode
    } else if (this.selectedIndustryCode) {
      this.sectorCode = this.selectedSectorCode
      this.form.industryCode = this.selectedIndustryCode
    } else if (
      Number(this.selectedSectorCode) === -1 ||
      (Number(this.selectedSectorCode) !== -1 &&
        this.selectedIndustryCode === null)
    ) {
      this.sectorCode = this.sectors[0].code
      this.form.industryCode = this.industries[0].code
    }
  },
  mounted() {
    document.getElementById('inputName').focus()
  },
  methods: {
    activateInput() {
      document.getElementById('inputLogo').click()
    },
    updateLogo() {
      const t = this
      this.imageFile = document.getElementById('inputLogo').files[0]
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        function () {
          if (reader.result.includes('data:image')) t.form.logo = reader.result
          else t.form.logo = ''
          t.$forceUpdate()
        },
        false
      )

      if (this.imageFile) {
        reader.readAsDataURL(this.imageFile)
      }
    },
  },
}
</script>
