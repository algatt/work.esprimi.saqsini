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

    <!--    <div class="flex flex-col">-->
    <!--      <div class="flex items-center">-->
    <!--        <label for="inputDob" class="label-optional">Birth Date</label>-->
    <!--        <span v-if="$v.form.dob.$error">-->
    <!--          <span v-if="!$v.form.dob.between" class="error"-->
    <!--            >Date cannot be before 1900 or in the future.</span-->
    <!--          ></span-->
    <!--        >-->
    <!--      </div>-->
    <!--      <input-->
    <!--        id="inputDob"-->
    <!--        v-model="form.dob"-->
    <!--        class="input"-->
    <!--        type="date"-->
    <!--        @change="$v.form.dob.$touch()"-->
    <!--      />-->
    <!--    </div>-->

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
// import moment from 'moment'
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
