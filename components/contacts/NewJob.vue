<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col">
      <label for="inputCompany" class="label">Company</label>
      <select
        id="inputCompany"
        v-model="form.companyCode"
        class="input select"
        @change="
          updateDepartments()
          form.departmentCode = null
        "
      >
        <option
          v-for="company in companies"
          :key="company.code"
          :value="company.code"
          @click="form.companyName = company.name"
        >
          {{ company.name }}
        </option>
      </select>
    </div>

    <div class="flex flex-col">
      <label for="inputDepartment" class="label">Department</label>
      <select
        id="inputDepartment"
        v-model="form.departmentCode"
        class="input select"
      >
        <option
          v-for="department in departments"
          :key="department.code"
          :value="department.code"
          @click="form.departmentName = department.name"
        >
          {{ department.name }}
        </option>
      </select>
    </div>

    <div class="flex flex-col">
      <label for="inputRole" class="label">Role</label>
      <select id="inputRole" v-model="form.roleCode" class="input select">
        <option
          v-for="role in roles"
          :key="role.code"
          :value="role.code"
          @click="form.roleName = role.name"
        >
          {{ role.name }}
        </option>
      </select>
    </div>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputEmail" class="label">Email</label>
        <span v-if="$v.form.email.$error">
          <span v-if="!$v.form.email.email" class="error"
            >Invalid email format.</span
          ></span
        >
      </div>
      <input
        id="inputEmail"
        v-model="form.email"
        placeholder="Enter email address"
        class="input"
        @change="$v.form.email.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputPhone" class="label">Phone</label>
        <span v-if="!isPhoneValid" class="error">invalid phone</span>
      </div>
      <vue-tel-input
        id="inputPhone"
        v-model="phoneNumber"
        class="border-2 border-gray-300 rounded-sm py-1 focus:bg-gray-100 focus:border-primary transition duration-500 ring-offset-2 focus:outline-none"
        @validate="validatePhone"
      />
    </div>

    <div class="flex items-center">
      <toggle-switch :checked="form.isActive" @clicked="form.isActive = $event">
        <template v-slot:leftLabel>Not Active</template>
        <template v-slot:rightLabel>Active</template>
      </toggle-switch>
      <popup-info
        ><template v-slot:text
          >Determines if employee is still active in this position or
          not.</template
        ></popup-info
      >
    </div>

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
import ToggleSwitch from '~/components/layouts/ToggleSwitch'
import PopupInfo from '~/components/layouts/PopupInfo'

export default {
  name: 'NewJob',
  components: { PopupInfo, ToggleSwitch, EditObjectModalBottomPart },
  mixins: [validationMixin],

  data() {
    return {
      form: null,
      phoneNumber: '',
      checkPhoneState: true,
      departments: '',
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
    depts() {
      return this.$store.getters.getSortedItems('departments')
    },
    roles() {
      return this.$store.getters.getSortedItems('roles')
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.item))

    if (!this.form.companyCode) {
      this.form.companyCode = Number(this.companies[0].code)
      this.form.companyName = this.companies[0].name
    }
    if (!this.form.departmentCode) this.form.departmentCode = null
    if (!this.form.roleCode) {
      this.form.roleCode = this.roles[0].code
      this.form.roleName = this.roles[0].name
    }
    this.form.contactCode = this.$route.params.id
    if (this.form.contactNumber)
      this.phoneNumber = (
        this.form.countryExtension +
        ' ' +
        this.form.contactNumber
      ).trim()

    if (this.form.flags)
      this.form.isActive = this.form.flags.includes('ONGOING')
    else this.form.isActive = true
  },
  mounted() {
    document.getElementById('inputCompany').focus()
    this.updateDepartments()
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
    updateDepartments() {
      let x = JSON.parse(JSON.stringify(this.depts))
      x = x.filter((el) => {
        return el.companyCode === this.form.companyCode
      })
      x.unshift({ code: null, name: 'No Department' })
      this.departments = x
    },
  },
}
</script>

<style>
.vue-tel-input {
  /*@apply border-2 border-gray-300 rounded-sm px-3 py-2 focus:bg-gray-100 focus:border-primary transition duration-500 ring-offset-2 focus:outline-none;*/
  /*@apply border-b border-gray-200 px-1 py-2 focus:border-primary transition duration-500 ease-in focus:outline-none;*/
  border: none !important;
  box-shadow: none !important;
  padding: 2px 1px !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-radius: 0px !important;
}
</style>
