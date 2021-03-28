<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
      <div class="flex flex-col">
        <div class="flex items-center">
          <label for="inputName" class="label">Name</label>
          <span v-if="$v.form.name.$error">
            <span v-if="!$v.form.name.required" class="error">required</span
            ><span v-else-if="!$v.form.name.uniqueNames" class="error"
              >this role already exists</span
            ></span
          >
        </div>
        <input
          id="inputName"
          v-model="form.name"
          placeholder="Enter role name"
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
    </div>

    <edit-object-modal-bottom-part
      class="pt-10 pb-5"
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
        return el.code !== this.form.code ? el.abbr.toLowerCase() : ''
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
