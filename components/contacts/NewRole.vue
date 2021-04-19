<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
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
        @change="$v.form.name.$touch()"
        >Name</input-base
      >

      <input-base
        id="inputAbbr"
        v-model="form.abbr"
        :error="
          $v.form.abbr.$model !== undefined
            ? !$v.form.abbr.required
              ? 'required'
              : !$v.form.abbr.uniqueAbbr
              ? 'this abbreviation already exists '
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
