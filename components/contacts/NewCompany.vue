<template>
  <div class="flex flex-col w-full space-y-7">
    <l-select
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
      ></l-select
    >

    <l-select v-model="form.industryCode" @input="form.industryCode = $event"
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
      ></l-select
    >

    <l-input
      id="inputName"
      v-model="form.name"
      :error="
        $v.form.name.$model !== undefined && !$v.form.name.required
          ? 'required'
          : null
      "
      @change="$v.form.name.$touch()"
      >Company Name</l-input
    >

    <l-input
      id="inputAbbr"
      v-model="form.abbr"
      :error="
        $v.form.abbr.$model !== undefined && !$v.form.abbr.required
          ? 'required'
          : null
      "
      @change="$v.form.abbr.$touch()"
      >Abbreviation</l-input
    >

    <l-input
      id="inputSize"
      v-model="form.size"
      :error="
        $v.form.size.$model !== undefined && !$v.form.size.numeric
          ? 'size must be a number'
          : null
      "
      @change="$v.form.size.$touch()"
      >Company Size</l-input
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
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, numeric } from 'vuelidate/lib/validators'

export default {
  name: 'NewCompany',

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
    dataItem: {
      type: Object,
      required: true,
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

    sectors() {
      let x = JSON.parse(JSON.stringify(this.$store.state.sectors.items))

      let allIndustries = this.$store.state.industries.items
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
      let x = JSON.parse(JSON.stringify(this.$store.state.industries.items))

      if (this.sectorCode)
        x = x.filter((el) => {
          return el.sectorCode === this.sectorCode
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
    this.form = JSON.parse(JSON.stringify(this.dataItem))

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
