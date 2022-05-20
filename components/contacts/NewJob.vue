<template>
  <div class="flex flex-col w-full space-y-5">
    <l-select
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
      ></l-select
    >

    <l-select id="inputDepartment" v-model="form.departmentCode"
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
      ></l-select
    >

    <l-select id="inputRole" v-model="form.roleCode"
      >Role<template v-slot:options
        ><option
          v-for="role in roles"
          :key="role.code"
          :value="role.code"
          @click="form.roleName = role.name"
        >
          {{ role.name }}
        </option></template
      ></l-select
    >

    <l-input
      v-model="form.email"
      :error="
        $v.form.email.$model !== undefined
          ? !$v.form.email.email
            ? 'invalid email'
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
        class="border-2 border-gray-300 rounded-sm py-1 focus:bg-gray-100 focus:border-primary transition duration-500 ring-offset-2 focus:outline-none"
        @validate="validatePhone"
      />
      <span v-if="!isPhoneValid" class="text-sm text-red-600 px-1 py-1"
        >invalid phone</span
      >
      <span v-else class="text-sm">&nbsp;</span>
    </div>

    <div class="flex items-center">
      <l-toggle :checked="form.isActive" @clicked="form.isActive = $event">
        <template v-slot:label
          >Job Status
          <popup-information class="ml-2"
            >Determines if employee is still active in this position or
            not.</popup-information
          ></template
        >
        <template v-slot:leftLabel>Not Active</template>
        <template v-slot:rightLabel>Active</template>
      </l-toggle>
    </div>

    <p class="font-bold">Additional Attributes</p>
    <div class="flex flex-wrap space-x-3">
      <span
        v-for="(attr, index) in availableAdditionalAttributes"
        :key="index"
        class="bg-gray-50 border border-gray-100 px-1 py-0.5 rounded cursor-pointer hover:bg-gray-100 hover:border-gray-200"
        @click="addAdditionalAttribute(attr)"
        >{{ attr }}</span
      >
    </div>
    <div
      v-for="(additional, index) in Object.keys(form.additionalAttributes)"
      :key="index"
      class="w-full flex items-stretch"
    >
      <div class="pr-5 flex flex-1 items-center">
        <l-input
          v-model="form.additionalAttributes[additional]"
          class="w-full"
          >{{ additional }}</l-input
        >
      </div>
      <div class="w-32 flex items-center pt-6">
        <button
          class="font-semibold cursor-pointer text-gray-600 hover:text-red-600"
          @click="removeAdditionalAttribute(additional)"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email } from 'vuelidate/lib/validators'

import LSelect from '@/components/LSelect'
import LToggle from '@/components/LToggle'

export default {
  name: 'NewJob',
  components: {
    LToggle,
    LSelect,
  },
  mixins: [validationMixin],
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
      departments: '',
      additionalAttributes: null,
      existingAdditionalAttributes: [],
      availableAdditionalAttributes: [],
    }
  },
  validations: {
    form: {
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

    companies() {
      return this.$store.state.companies.items
    },
    depts() {
      return this.$store.getters['departments/sortedDeparments']
    },
    roles() {
      return this.$store.getters['roles/sortedRoles']
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

    const selectedContactList = this.$store.state.selectedContactList
    this.additionalAttributes = this.$store.state.contactlist.items.find(
      (el) => {
        return el.code === selectedContactList.code
      }
    ).additionalAttributes
    if (!this.form.additionalAttributes) this.form.additionalAttributes = {}
    for (const i in this.additionalAttributes) {
      if (!Object.keys(this.form.additionalAttributes).includes(i))
        this.availableAdditionalAttributes.push(i)
    }
  },
  mounted() {
    document.getElementById('inputCompany').focus()
    this.updateDepartments()
    this.$watch(
      'isValid',
      (val) => {
        if (typeof val !== 'undefined') {
          this.$emit('valid', this.isValid)
        }
      },
      { deep: true, immediate: true }
    )
  },

  methods: {
    addAdditionalAttribute(attr) {
      this.availableAdditionalAttributes =
        this.availableAdditionalAttributes.filter((el) => {
          return el !== attr
        })
      this.form.additionalAttributes[attr] = ''
    },
    removeAdditionalAttribute(attr) {
      this.availableAdditionalAttributes.push(attr)
      delete this.form.additionalAttributes[attr]
    },
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
          .replaceAll(' ', '')
          .replaceAll('-', '')
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
