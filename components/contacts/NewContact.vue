<template>
  <div class="flex flex-col w-full md:w-10/12">
    <label for="inputName" class="label-required">Full Name</label>
    <input
      id="inputName"
      v-model="form.displayName"
      placeholder="Enter full name"
      class="input"
      @change="$v.form.displayName.$touch()"
    />
    <span v-if="!$v.form.displayName.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.displayName.required" class="error"
        >The name is required.</span
      ></span
    >

    <label for="inputGender" class="label">Gender</label>
    <select id="inputGender" v-model="form.gender" class="input select">
      <option
        v-for="genderItem in gender"
        :key="genderItem.value"
        :value="genderItem.value"
      >
        {{ genderItem.text }}
      </option>
    </select>
    <span>&nbsp;</span>

    <label for="inputDob" class="label">Birth Date</label>
    <input
      id="inputDob"
      v-model="form.dob"
      class="input"
      type="date"
      @change="$v.form.dob.$touch()"
    />
    <span v-if="!$v.form.dob.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.dob.between" class="error"
        >Date cannot be before 1900 or in the future.</span
      ></span
    >

    <label for="inputEmail" class="label">Email</label>
    <input
      id="inputEmail"
      v-model="form.email"
      placeholder="Enter email address"
      class="input"
      @change="$v.form.email.$touch()"
    />
    <span v-if="!$v.form.email.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.email.email" class="error"
        >Invalid email format.</span
      ></span
    >

    <label for="inputPhone" class="label">Phone</label>
    <vue-tel-input
      id="inputPhone"
      v-model="phoneNumber"
      class="border-2 border-gray-300 rounded-sm py-1 focus:bg-gray-100 focus:border-primary transition duration-500 ring-offset-2 focus:outline-none"
      @validate="validatePhone"
    />
    <span v-if="isPhoneValid">&nbsp;</span>
    <span v-else class="error">Invalid phone</span>

    <edit-object-modal-bottom-part
      :form="form"
      which="contacts"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import moment from 'moment'
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'

export default {
  name: 'NewContact',
  components: { EditObjectModalBottomPart },
  mixins: [validationMixin],
  validations: {
    form: {
      displayName: {
        required,
      },
      dob: {
        between(value) {
          if (value === '' || value === undefined) return true
          return !(moment(value) > moment() || moment(value).get('year') < 1900)
        },
      },
      email: {
        email,
      },
    },
  },
  data() {
    return {
      form: null,
      phoneNumber: '',
      checkPhoneState: true,
      gender: [
        { text: 'Female', value: 'F' },
        { text: 'Male', value: 'M' },
        { text: 'Unspecified', value: 'X' },
      ],
    }
  },
  computed: {
    isPhoneValid() {
      return this.phoneNumber === '' || this.checkPhoneState
    },
    isValid() {
      return !this.$v.$invalid && this.isPhoneValid
    },
    item() {
      return this.$store.state.currentItemToBeEdited
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.item))
    if (!this.form.gender) this.form.gender = 'X'
    if (this.form.contactNumber)
      this.phoneNumber = (
        this.form.countryExtension +
        ' ' +
        this.form.contactNumber
      ).trim()
  },
  mounted() {
    document.getElementById('inputName').focus()
  },
  methods: {
    validatePhone(ev) {
      this.checkPhoneState = ev.valid
      if (ev.valid) {
        this.form.countryExtension = this.phoneNumber
          .substring(0, this.phoneNumber.indexOf(' '))
          .trim()
          .replace(' ', '')
          .replace('+', '')
        this.form.contactNumber = this.phoneNumber
          .substring(this.phoneNumber.indexOf(' '), this.phoneNumber.length)
          .trim()
          .replace(' ', '')
      }
    },
  },
}
</script>
