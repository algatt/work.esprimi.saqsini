<template>
  <div class="flex flex-col w-full md:w-10/12">
    <label for="inputCompany" class="label-required">Company</label>
    <select
      id="inputCompany"
      v-model="form.companyCode"
      class="input select"
      @change="form.departmentCode = null"
    >
      <option
        v-for="company in companies"
        :key="company.code"
        :value="company.code"
      >
        {{ company.name }}
      </option>
    </select>
    <span>&nbsp;</span>

    <label for="inputDepartment" class="label-required">Department</label>
    <select
      id="inputDepartment"
      v-model="form.departmentCode"
      class="input select"
    >
      <option
        v-for="department in departments"
        :key="department.code"
        :value="department.code"
      >
        {{ department.name }}
      </option>
    </select>
    <span>&nbsp;</span>

    <label for="inputRole" class="label-required">Role</label>
    <select id="inputRole" v-model="form.roleCode" class="input select">
      <option v-for="role in roles" :key="role.code" :value="role.code">
        {{ role.name }}
      </option>
    </select>
    <span>&nbsp;</span>

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

    <label class="label" for="inputActive"
      >Currently Active in this Position</label
    >
    <div class="flex space-x-2 items-center">
      <p class="text-sm">No</p>
      <input
        id="inputActive"
        v-model="form.isActive"
        type="checkbox"
        class="checkbox"
      /><label for="inputActive" class="switch"></label>
      <p class="text-sm">Yes</p>
    </div>

    <span v-if="isPhoneValid">&nbsp;</span>
    <span v-else class="error">Invalid phone</span>

    <edit-object-modal-bottom-part
      :form="form"
      which="jobs"
      :is-valid="true"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email, required } from 'vuelidate/lib/validators'
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'

export default {
  name: 'NewJob',
  components: { EditObjectModalBottomPart },
  mixins: [validationMixin],

  data() {
    return {
      form: null,
      phoneNumber: '',
      checkPhoneState: true,
    }
  },
  validations: {
    form: {
      displayName: {
        required,
      },

      email: {
        email,
      },
    },
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
    companies() {
      return this.$store.getters.getSortedItems('companies')
    },
    departments() {
      let x = this.$store.getters.getSortedItems('departments')
      x = x.filter((el) => {
        return el.companyCode === this.form.companyCode
      })
      x.unshift({ code: null, name: 'No Department' })
      return x
    },
    roles() {
      return this.$store.getters.getSortedItems('roles')
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.item))
    if (!this.form.companyCode)
      this.form.companyCode = Number(this.companies[0].code)
    if (!this.form.departmentCode) this.form.departmentCode = null
    if (!this.form.roleCode) this.form.roleCode = this.roles[0].code
    this.form.contactCode = this.$route.params.id
    if (this.form.contactNumber)
      this.phoneNumber = (
        this.form.countryExtension +
        ' ' +
        this.form.contactNumber
      ).trim()
    if (this.form.flags)
      this.form.isActive = this.form.flags.includes('ONGOING')
  },
  mounted() {
    document.getElementById('inputCompany').focus()
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
