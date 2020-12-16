<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col">
      <label for="inputSector" class="label">Sector</label>
      <select id="inputSector" v-model="form.sectorCode" class="input select">
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
      <div class="flex items-center">
        <label for="inputName" class="label">Industry</label>
        <span v-if="$v.form.name.$error">
          <span v-if="!$v.form.name.required" class="error">required</span
          ><span v-else-if="!$v.form.name.uniqueNames" class="error"
            >this industry already exists</span
          ></span
        >
      </div>
      <input
        id="inputName"
        v-model="form.name"
        placeholder="Enter industry name"
        class="input"
        @change="$v.form.name.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputAbbr" class="label">Abbreviation</label>
        <span v-if="$v.form.abbr.$error">
          <span v-if="!$v.form.abbr.required" class="error">required</span>
          <span v-else-if="!$v.form.abbr.uniqueAbbr" class="error"
            >this abbreviation already exists</span
          ></span
        >
      </div>
      <input
        id="inputAbbr"
        v-model="form.abbr"
        placeholder="Enter abbreviation"
        class="input"
        @change="$v.form.abbr.$touch()"
      />
    </div>

    <edit-object-modal-bottom-part
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

export default {
  name: 'NewIndustry',
  components: { EditObjectModalBottomPart },
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
          ? el.name.toLowerCase()
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
