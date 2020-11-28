<template>
  <div class="flex flex-col w-full md:w-10/12">
    <label for="inputName" class="label-required">Full Name</label>
    <input
      id="inputName"
      v-model="newItem.displayName"
      placeholder="Enter full name"
      class="input"
      @change="$v.newItem.displayName.$touch()"
    />
    <span v-if="!$v.newItem.displayName.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.newItem.displayName.required" class="error"
        >The name is required.</span
      ></span
    >

    <label for="inputGender" class="label">Gender</label>
    <select id="inputGender" v-model="newItem.gender" class="input select">
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
      v-model="newItem.dateOfBirth"
      class="input"
      type="date"
      @change="$v.newItem.dateOfBirth.$touch()"
    />
    <span v-if="!$v.newItem.dateOfBirth.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.newItem.dateOfBirth.between" class="error"
        >Date cannot be before 1900 or in the future.</span
      ></span
    >

    <label for="inputEmail" class="label">Email</label>
    <input
      id="inputEmail"
      v-model="newItem.email"
      placeholder="Enter email address"
      class="input"
      @change="$v.newItem.email.$touch()"
    />
    <span v-if="!$v.newItem.email.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.newItem.email.email" class="error"
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

    <div
      class="flex flex-wrap absolute bottom-0 left-0 w-full justify-end px-5 pb-3 h-16 justify-between items-center"
    >
      <div class="flex flex-wrap items-center w-6/12">
        <button class="btn-round-primary" @click="cancelCurrentItem">
          <i class="fas fa-times fa-fw"></i>
        </button>
      </div>

      <div class="flex flex-wrap items-center w-6/12 justify-end">
        <button
          class="btn-round-danger mr-2"
          :disabled="newItem.code === -1"
          @click="deleteItem"
        >
          <i class="far fa-trash-alt fa-fw"></i>
        </button>
        <button
          class="btn-round-primary mr-2"
          :disabled="!isValid"
          @click="saveItem"
        >
          <i class="fas fa-save fa-fw"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import moment from 'moment'

export default {
  name: 'NewContact',

  mixins: [validationMixin],
  props: {
    item: {
      required: true,
      type: Object,
    },
  },
  validations: {
    newItem: {
      displayName: {
        required,
      },
      dateOfBirth: {
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
      newItem: null,
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

  created() {
    this.newItem = JSON.parse(JSON.stringify(this.item))
    if (!this.newItem.gender) this.newItem.gender = 'X'
  },

  methods: {
    cancelCurrentItem() {
      this.$store.dispatch('setCurrentItemToBeEdited', null)
    },
    validatePhone(ev) {
      this.checkPhoneState = ev.valid
      if (ev.valid) {
        this.newItem.countryExtension = this.phoneNumber
          .substring(0, this.phoneNumber.indexOf(' '))
          .trim()
          .replace(' ', '')
          .replace('+', '')
        this.newItem.contactNumber = this.phoneNumber
          .substring(this.phoneNumber.indexOf(' '), this.phoneNumber.length)
          .trim()
          .replace(' ', '')
      }
    },
    saveItem() {
      if (this.newItem.code === -1) {
        this.$store.dispatch('contacts/newContact', this.newItem)
      } else {
        this.$store.dispatch('contacts/updateContact', this.newItem)
      }
      this.cancelCurrentItem()
    },
    deleteItem() {
      this.$store
        .dispatch('contacts/deleteContact', this.newItem.code)
        .then(() => {
          this.cancelCurrentItem()
        })
    },
  },
}
</script>
