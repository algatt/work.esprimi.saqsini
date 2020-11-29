<template>
  <div class="flex flex-col w-full md:w-10/12">
    <label for="inputName" class="label-required">Name</label>
    <input
      id="inputName"
      v-model="form.name"
      placeholder="Enter role name"
      class="input"
      @change="$v.form.name.$touch()"
    />
    <span v-if="!$v.form.name.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.name.required" class="error"
        >The name is required.</span
      ><span v-else-if="!$v.form.name.uniqueNames" class="error"
        >This role already exists.</span
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
      <span v-else-if="!$v.form.abbr.uniqueAbbr" class="error"
        >This abbreviation already exists.</span
      ></span
    >

    <edit-object-modal-bottom-part
      :form="form"
      which="roles"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'

export default {
  name: 'NewRole',
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
    roles() {
      return this.$store.getters.getItems('roles')
    },
    uniqueNames() {
      return this.roles.map((el) => {
        return el.code !== this.form.code ? el.name.toLowerCase() : ''
      })
    },
    uniqueAbbr() {
      return this.roles.map((el) => {
        return el.code !== this.form.code ? el.name.toLowerCase() : ''
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
