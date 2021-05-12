<template>
  <div class="flex flex-col w-full space-y-7">
    <l-input
      id="inputName"
      v-model="form.name"
      :error="
        $v.form.name.$model !== undefined && !$v.form.name.required
          ? 'required'
          : null
      "
      placeholder="Enter list reference name"
      @change="$v.form.name.$touch"
      >List Name</l-input
    >

    <p class="font-semibold">Contact List</p>
    <input
      v-if="!form.code"
      id="inputData"
      type="file"
      @change="fileSelected"
    />

    <l-input
      id="inputValidity"
      v-model="form.deleteBy"
      :error="
        $v.form.deleteBy.$model !== undefined && !$v.form.deleteBy.check
          ? 'date cannot be in the past'
          : null
      "
      type="date"
      @change="$v.form.deleteBy.$touch()"
      >Valid Until</l-input
    >
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { DateTime } from 'luxon'

export default {
  name: 'NewContactList',
  mixins: [validationMixin],
  validations: {
    form: {
      name: {
        required,
      },
      deleteBy: {
        check(value) {
          if (value === '' || value === undefined) return true
          return DateTime.fromSQL(value) > DateTime.now()
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
  methods: {
    fileSelected(event) {
      this.form.dataFile = document.getElementById('inputData').files[0]
    },
  },
}
</script>
