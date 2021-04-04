<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-2">
      <select-base
        v-model="sectorCode"
        @input="form.industryCode = industries[0].code"
        >Sector
        <template v-slot:options
          ><option
            v-for="sector in sectors"
            :key="sector.code"
            :value="sector.code"
            :selected="sector.code === sectorCode"
          >
            {{ sector.name }}
          </option></template
        ></select-base
      >

      <select-base
        v-model="form.industryCode"
        @input="form.industryCode = $event"
        >Industry
        <template v-slot:options
          ><option
            v-for="industry in industries"
            :key="industry.code"
            :value="industry.code"
            :selected="industry.code === form.industryCode"
          >
            {{ industry.name }}
          </option></template
        ></select-base
      >

      <input-base
        id="inputName"
        v-model="form.name"
        :error="
          $v.form.name.$model !== undefined && !$v.form.name.required
            ? 'required'
            : null
        "
        @change="$v.form.name.$touch()"
        >Company Name</input-base
      >

      <input-base
        id="inputAbbr"
        v-model="form.abbr"
        :error="
          $v.form.abbr.$model !== undefined && !$v.form.abbr.required
            ? 'required'
            : null
        "
        @change="$v.form.abbr.$touch()"
        >Abbreviation</input-base
      >

      <input-base
        id="inputSize"
        v-model="form.size"
        :error="
          $v.form.size.$model !== undefined && !$v.form.size.numeric
            ? 'size must be a number'
            : null
        "
        @change="$v.form.size.$touch()"
        >Company Size</input-base
      >

      <div class="flex flex-col">
        <label for="inputLogo" class="font-semibold">Company Logo</label>
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
import SelectBase from '~/components/elements/SelectBase'
import InputBase from '~/components/elements/InputBase'

export default {
  name: 'NewCompany',
  components: { InputBase, SelectBase, EditObjectModalBottomPart },
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
    const obj = document
      .getElementById('inputName')
      .getElementsByTagName('input')[0]
    obj.focus()
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
