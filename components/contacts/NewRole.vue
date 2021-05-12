<template>
  <div class="flex flex-col w-full space-y-7">
    <l-input
      id="inputName"
      v-model="form.name"
      :error="
        $v.form.name.$model !== undefined
          ? !$v.form.name.required
            ? 'required'
            : null
          : null
      "
      @change="$v.form.name.$touch()"
      >Name</l-input
    >

    <l-input
      id="inputAbbr"
      v-model="form.abbr"
      :error="
        $v.form.abbr.$model !== undefined
          ? !$v.form.abbr.required
            ? 'required'
            : !$v.form.abbr.uniqueAbbr
            ? 'this abbreviation already exists '
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
  name: 'NewRole',
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
      required: true,
      type: Object,
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
    roles() {
      return this.$store.state.roles.items
    },
    uniqueNames() {
      return this.roles.map((el) => {
        return el.code !== this.form.code ? el.name.toLowerCase() : ''
      })
    },
    uniqueAbbr() {
      return this.roles.map((el) => {
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
