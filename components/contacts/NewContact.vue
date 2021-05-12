<template>
  <div class="flex flex-col w-full space-y-7">
    <l-input
      id="inputName"
      v-model="form.displayName"
      :error="
        $v.form.displayName.$model !== undefined
          ? !$v.form.displayName.required
            ? 'required'
            : null
          : null
      "
      @change="$v.form.displayName.$touch()"
      >Full Name</l-input
    >

    <l-select v-model="form.gender">
      Gender
      <template v-slot:options>
        <option
          v-for="genderItem in gender"
          :key="genderItem.value"
          :value="genderItem.value"
        >
          {{ genderItem.text }}
        </option>
      </template>
    </l-select>

    <l-input
      id="inputDob"
      v-model="form.dob"
      type="date"
      :error="
        $v.form.dob.$model !== undefined
          ? !$v.form.dob.between
            ? 'data cannot be before 1900, or in the future'
            : null
          : null
      "
      @change="$v.form.dob.$touch()"
      >Date of Birth</l-input
    >

    <l-input
      id="inputEmail"
      v-model="form.email"
      :error="
        $v.form.email.$model !== undefined
          ? !$v.form.email.email
            ? 'invalid email format'
            : null
          : null
      "
      @change="$v.form.email.$touch()"
      >Email</l-input
    >

    <div class="flex flex-col">
      <label for="inputPhone" class="font-semibold">Phone</label>

      <vue-tel-input
        id="inputPhone"
        v-model="phoneNumber"
        @validate="validatePhone"
      />
      <span v-if="!isPhoneValid" class="text-sm text-red-600 px-1 py-1"
        >invalid phone</span
      >
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { DateTime } from 'luxon'
import LSelect from '~/components/LSelect'

export default {
  name: 'NewContact',
  components: { LSelect },
  mixins: [validationMixin],
  validations: {
    form: {
      displayName: {
        required,
      },
      dob: {
        between(value) {
          if (value === '' || value === undefined) return true
          return !(
            DateTime.fromSQL(value) > DateTime.now() ||
            DateTime.fromSQL(value).year < 1900
          )
        },
      },
      email: {
        email,
      },
    },
  },
  props: {
    dataItem: {
      type: Object,
      required: true,
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
  },
  watch: {
    form: {
      handler(value) {
        this.$emit('update', value)
      },
      deep: true,
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.dataItem))
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
    this.$watch(
      '$v',
      (val) => {
        if (typeof val !== 'undefined') {
          this.$emit('valid', !this.$v.$invalid)
        }
      },
      { deep: true, immediate: true }
    )
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

<style>
.vue-tel-input {
  box-shadow: none !important;
  border: 2px solid rgb(229, 231, 235) !important;
  padding-top: 0.175rem !important;
  padding-bottom: 0.175rem !important;
}
</style>
