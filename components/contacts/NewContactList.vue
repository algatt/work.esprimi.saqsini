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

    <template v-if="!form.code">
      <p class="font-semibold">Contact List</p>
      <input id="inputData" type="file" @change="fileSelected" />
    </template>

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

    <div class="flex flex-col space-y-3">
      <p class="font-semibold">Additional Attributes for Contacts</p>
      <div class="flex flex-wrap items-center space-x-3">
        <div
          v-for="(attr, index) in Object.keys(form.additionalAttributes)"
          :key="index"
          class="flex items-center border bg-gray-50 rounded border-gray-100 py-1 px-2"
        >
          <span>{{ attr }}</span>
          <span
            class="cursor-pointer text-gray-600 hover:text-red-600 transition duration-300"
            @click="removeAttribute(attr)"
            ><i class="fas fa-times fa-fw ml-1"></i
          ></span>
        </div>
      </div>
      <div class="flex flex-wrap items-center">
        <span
          v-if="newAttr === false"
          class="text-primary cursor-pointer hover:underline"
          @click="enableNewAttr"
          >Add New</span
        >
        <l-input-button
          v-if="newAttr"
          ref="newAttr"
          v-model="newAttributeValue"
          :button-disabled="!isAttrValid"
          @click="addAttribute"
        >
          <template><i class="fas fa-save fa-fw"></i></template>
        </l-input-button>
        <span
          v-if="newAttr === true"
          class="text-primary cursor-pointer hover:underline mt-1 ml-2"
          @click="disableNewAttr"
          >Cancel</span
        >
      </div>
    </div>
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
      newAttr: false,
      newAttributeValue: '',
    }
  },
  computed: {
    isValid() {
      return !this.$v.$invalid
    },
    isAttrValid() {
      const currentValues = Object.keys(this.form.additionalAttributes)
      return (
        this.newAttributeValue.trim().length !== 0 &&
        !currentValues.includes(this.newAttributeValue)
      )
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
    enableNewAttr() {
      this.newAttr = true
      this.$nextTick(() => {
        try {
          this.$refs.newAttr.$el.children[1].firstChild.focus()
        } catch {}
      })
    },
    disableNewAttr() {
      this.newAttr = false
      this.newAttributeValue = ''
    },
    addAttribute() {
      this.form.additionalAttributes[this.newAttributeValue] = ''
      this.newAttributeValue = ''
      this.newAttr = false
    },
    removeAttribute(attr) {
      const keys = Object.keys(this.form.additionalAttributes).filter((el) => {
        return el !== attr
      })
      const result = new Set()
      for (const i in this.form.additionalAttributes) {
        if (keys.includes(i)) result[i] = this.form.additionalAttributes[i]
      }
      this.form.additionalAttributes = result
    },
  },
}
</script>
