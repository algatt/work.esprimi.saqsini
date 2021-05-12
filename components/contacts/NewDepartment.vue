<template>
  <div class="flex flex-col w-full space-y-7">
    <l-input
      id="inputName"
      v-model="form.name"
      :error="
        $v.form.name.$model !== undefined
          ? !$v.form.name.required
            ? 'required'
            : !$v.form.name.uniqueNames
            ? 'this department already exists'
            : null
          : null
      "
      @change="$v.form.name.$touch()"
      >Name</l-input
    >

    <l-input
      v-model="form.abbr"
      :error="
        $v.form.abbr.$model !== undefined
          ? !$v.form.abbr.required
            ? 'required'
            : !$v.form.abbr.uniqueAbbr
            ? 'this abbreviation already exists'
            : null
          : null
      "
      @change="$v.form.abbr.$touch()"
      >Abbreviation</l-input
    >
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'NewDepartment',

  mixins: [validationMixin],
  validations: {
    form: {
      name: {
        required,
        uniqueNames(value) {
          return (
            value === undefined ||
            !this.uniqueNames.includes(value.trim().toLowerCase())
          )
        },
      },
      abbr: {
        required,
        uniqueAbbr(value) {
          return (
            value === undefined ||
            !this.uniqueAbbr.includes(value.trim().toLowerCase())
          )
        },
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
    }
  },
  computed: {
    isValid() {
      return !this.$v.$invalid
    },
    departments() {
      return this.$store.state.departments.items
    },
    uniqueNames() {
      return this.departments.map((el) => {
        return el.code !== this.form.code ? el.name.toLowerCase() : ''
      })
    },
    uniqueAbbr() {
      return this.departments.map((el) => {
        return el.code !== this.form.code ? el.abbr.toLowerCase() : ''
      })
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
    if (!this.form.companyCode) this.form.companyCode = this.$route.params.id
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
}
</script>
