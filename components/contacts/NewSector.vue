<template>
  <div class="flex flex-col w-full md:w-10/12">
    <label for="inputName" class="label-required">Sector</label>
    <input
      id="inputName"
      v-model="form.name"
      placeholder="Enter sector name"
      class="input"
      @change="$v.form.name.$touch()"
    />
    <span v-if="!$v.form.name.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.name.required" class="error"
        >The name is required.</span
      ></span
    >

    <edit-object-modal-bottom-part
      :form="form"
      which="'sectors'"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
// import { required, email } from 'vuelidate/lib/validators'

import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'

export default {
  name: 'NewSector',
  components: [EditObjectModalBottomPart],
  mixins: [validationMixin],
  validations: {
    form: {
      name: {},
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
  methods: {},
}
</script>
