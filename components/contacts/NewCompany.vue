<template>
  <div class="flex flex-col w-full md:w-10/12">
    <label for="inputSector" class="label-required">Sector</label>
    <select
      id="inputSector"
      v-model="sectorCode"
      class="input select"
      @change="form.industryCode = industries[0].code"
    >
      <option v-for="sector in sectors" :key="sector.code" :value="sector.code">
        {{ sector.name }}
      </option>
    </select>
    <span>&nbsp;</span>

    <label for="inputIndustry" class="label-required">Industry</label>
    <select id="inputIndustry" v-model="form.industryCode" class="input select">
      <option
        v-for="industry in industries"
        :key="industry.code"
        :value="industry.code"
      >
        {{ industry.name }}
      </option>
    </select>
    <span>&nbsp;</span>

    <label for="inputName" class="label-required">Name</label>
    <input
      id="inputName"
      v-model="form.name"
      placeholder="Enter company name"
      class="input"
      @change="$v.form.name.$touch()"
    />
    <span v-if="!$v.form.name.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.name.required" class="error"
        >The name is required.</span
      ></span
    >

    <label for="inputAbbr" class="label-required">Abbreviation</label>
    <input
      id="inputAbbr"
      v-model="form.abbr"
      placeholder="Enter abbreviation"
      class="input"
      @change="$v.form.abbr.$touch()"
    />
    <span v-if="!$v.form.abbr.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.abbr.required" class="error"
        >The name is required.</span
      >
    </span>

    <label for="inputSize" class="label">Company Size</label>
    <input
      id="inputSize"
      v-model="form.size"
      placeholder="Enter company size"
      class="input"
      @change="$v.form.size.$touch()"
    />
    <span v-if="!$v.form.size.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.size.numeric" class="error"
        >The company size must be a number.</span
      >
    </span>

    <label for="inputLogo" class="label">Company Logo</label>
    <input id="inputLogo" type="file" hidden @change="updateLogo" />
    <div class="flex justify-start items-center mb-10">
      <button
        class="text-primary focus:outline-none hover:text-primary-darker h-24 w-24"
        @click="activateInput"
      >
        <img v-if="form.logo" :src="form.logo" class="rounded bg-cover" />
        <i v-else class="far fa-image fa-fw fa-3x"></i>
      </button>
    </div>
    <span>&nbsp;</span>

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
    } else {
      this.sectorCode = this.sectors[0].code
      this.form.industryCode = this.industries[0].code
    }
  },
  mounted() {
    // document.getElementById('inputName').focus()
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
