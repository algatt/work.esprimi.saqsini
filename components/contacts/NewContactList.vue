<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
      <input-base
        id="inputName"
        v-model="form.name"
        value="form.name"
        :error="
          $v.form.name.$model !== undefined && !$v.form.name.required
            ? 'required'
            : null
        "
        placeholder="Enter list reference name"
        @change="$v.form.name.$touch"
        >List Name</input-base
      >

      <input-base
        v-if="form.code === -1"
        id="inputData"
        type="file"
        placeholder="Upload List Template"
        @change="fileSelected"
        >List Data</input-base
      >

      <input-base
        id="inputValidity"
        v-model="form.deleteBy"
        :error="
          $v.form.deleteBy.$model !== undefined && !$v.form.deleteBy.check
            ? 'date cannot be in the past'
            : null
        "
        type="date"
        @change="$v.form.deleteBy.$touch()"
        >Valid Until</input-base
      >
    </div>
    <edit-object-modal-bottom-part
      :form="form"
      which="contactlist"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
import InputBase from '~/components/elements/InputBase'

export default {
  name: 'NewContactList',
  components: { InputBase, EditObjectModalBottomPart },
  mixins: [validationMixin],
  validations: {
    form: {
      name: {
        required,
      },
      deleteBy: {
        check(value) {
          if (value === '' || value === undefined) return true
          return moment(value) > moment()
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
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.item))
  },
  mounted() {
    const obj = document
      .getElementById('inputName')
      .getElementsByTagName('input')[0]
    obj.focus()
  },
  methods: {
    fileSelected(event) {
      const files = document.getElementById('inputData').files
      this.form.dataFile = files[0]
    },
  },
}
</script>
