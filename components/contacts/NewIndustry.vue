<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
      <select-base id="inputSector" v-model="form.sectorCode"
        >Sector
        <template v-slot:options>
          <option
            v-for="sector in sectors"
            :key="sector.code"
            :value="sector.code"
            :selected="sector.code === item.sectorCode"
          >
            {{ sector.name }}
          </option></template
        ></select-base
      >

      <input-base
        id="inputName"
        v-model="form.name"
        :error="
          $v.form.name.$model !== undefined
            ? !$v.form.name.required
              ? 'required'
              : !$v.form.name.uniqueNames
              ? 'this industry already exists'
              : null
            : null
        "
        @change="$v.form.name.$touch()"
        >Industry Name</input-base
      >

      <input-base
        id="inputAbbr"
        v-model="form.abbr"
        :error="
          $v.form.abbr.$model !== undefined
            ? !$v.form.abbr.required
              ? 'required'
              : !$v.form.abbr.uniqueAbbr
              ? 'this abbreviation already exists'
              : null
            : null
        "
        @change="$v.form.abbr.$touch()"
        >Abbreviation</input-base
      >
    </div>
    <edit-object-modal-bottom-part
      class="pt-10 pb-5"
      :form="form"
      which="industries"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
import SelectBase from '~/components/elements/SelectBase'
import InputBase from '~/components/elements/InputBase'

export default {
  name: 'NewIndustry',
  components: { InputBase, SelectBase, EditObjectModalBottomPart },
  mixins: [validationMixin],
  validations: {
    form: {
      name: {
        required,
        uniqueNames(value) {
          return !this.uniqueNames.includes(value.trim().toLowerCase())
        },
      },
      abbr: {
        required,
        uniqueAbbr(value) {
          return !this.uniqueAbbr.includes(value.trim().toLowerCase())
        },
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
    sectors() {
      const x = JSON.parse(
        JSON.stringify(this.$store.getters.getItems('sectors'))
      )
      return x.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    industries() {
      return this.$store.getters.getItems('industries')
    },
    uniqueNames() {
      return this.industries.map((el) => {
        return el.code !== this.form.code ? el.name.toLowerCase() : ''
      })
    },
    uniqueAbbr() {
      return this.industries.map((el) => {
        return el.code !== this.form.code &&
          el.sectorCode === this.form.sectorCode
          ? el.abbr.toLowerCase()
          : ''
      })
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.item))
  },
  mounted() {
    document.getElementById('inputName').focus()
  },
  methods: {},
}
</script>
