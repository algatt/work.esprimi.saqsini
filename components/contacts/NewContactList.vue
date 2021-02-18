<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputName" class="label">List Name</label>
        <span v-if="$v.form.name.$error">
          <span v-if="!$v.form.name.required" class="error"
            >required</span
          ></span
        >
      </div>
      <input
        id="inputName"
        v-model="form.name"
        placeholder="Enter list reference name"
        class="input"
        @change="$v.form.name.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputData" class="label-optional">List Data</label>
      </div>
      <input
        id="inputData"
        type="file"
        placeholder="Upload a list template"
        class="input"
        @change="fileSelected"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputValidity" class="label-optional">Valid Until</label>
        <span v-if="$v.form.deleteBy.$error">
          <span v-if="!$v.form.deleteBy.check" class="error"
            >Date cannot be in the past.</span
          ></span
        >
      </div>
      <input
        id="inputValidity"
        v-model="form.deleteBy"
        class="input"
        type="date"
        @change="$v.form.deleteBy.$touch()"
      />
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

export default {
  name: 'NewContactList',
  components: { EditObjectModalBottomPart },
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
    // document.getElementById('inputName').focus()
  },
  methods: {
    fileSelected(event) {
      const files = document.getElementById('inputData').files
      this.form.dataFile = files[0]
    },
  },
}
</script>
