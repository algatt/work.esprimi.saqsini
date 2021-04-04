<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-2">
      <select-base
        id="inputCompany"
        v-model="form.companyCode"
        @input="
          updateDepartments()
          form.departmentCode = null
        "
        >Company<template v-slot:options
          ><option
            v-for="company in companies"
            :key="company.code"
            :value="company.code"
            :selected="form.companyCode === company.code"
          >
            {{ company.name }}
          </option></template
        ></select-base
      >

      <select-base id="inputDepartment" v-model="form.departmentCode"
        >Department<template v-slot:options
          ><option
            v-for="department in departments"
            :key="department.code"
            :value="department.code"
            :selected="form.departmentCode === department.code"
            @click="form.departmentName = department.name"
          >
            {{ department.name }}
          </option></template
        ></select-base
      >

      <select-base id="inputRole" v-model="form.roleCode"
        >Role<template v-slot:options
          ><option
            v-for="role in roles"
            :key="role.code"
            :value="role.code"
            @click="form.roleName = role.name"
          >
            {{ role.name }}
          </option></template
        ></select-base
      >

      <input-base
        v-model="form.email"
        :error="
          $v.form.email.$model !== undefined
            ? !$v.form.email.email
              ? 'invalid email'
              : null
            : null
        "
        @change="$v.form.email.$touch()"
        >Email</input-base
      >

      <div class="flex flex-col">
        <label for="inputPhone" class="font-semibold">Phone</label>

        <vue-tel-input
          id="inputPhone"
          v-model="phoneNumber"
          class="border-2 border-gray-300 rounded-sm py-1 focus:bg-gray-100 focus:border-primary transition duration-500 ring-offset-2 focus:outline-none"
          @validate="validatePhone"
        />
        <span v-if="!isPhoneValid" class="text-sm text-red-600 px-1 py-1"
          >invalid phone</span
        >
        <span v-else class="text-sm">&nbsp;</span>
      </div>

      <div class="flex items-center">
        <toggle-switch
          :checked="form.isActive"
          @clicked="form.isActive = $event"
        >
          <template v-slot:label
            >Job Status
            <popup-base class="ml-2"
              ><span class="font-normal"
                >Determines if employee is still active in this position or
                not.</span
              ></popup-base
            ></template
          >
          <template v-slot:leftLabel>Not Active</template>
          <template v-slot:rightLabel>Active</template>
        </toggle-switch>
      </div>
    </div>
    <edit-object-modal-bottom-part
      class="pt-10 pb-5"
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
import ToggleSwitch from '~/components/elements/ToggleSwitch'
import PopupBase from '~/components/elements/PopupBase'
import SelectBase from '~/components/elements/SelectBase'
import InputBase from '~/components/elements/InputBase'

export default {
  name: 'NewJob',
  components: {
    InputBase,
    SelectBase,
    PopupBase,
    ToggleSwitch,
    EditObjectModalBottomPart,
  },
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
  box-shadow: none !important;
  border: 2px solid rgb(229, 231, 235) !important;
  padding-top: 0.175rem !important;
  padding-bottom: 0.175rem !important;
}
</style>
