<template>
  <div class="flex flex-col w-full md:w-10/12">
    <label for="inputSector" class="label-required">Sector</label>
    <select id="inputSector" v-model="form.categoryCode" class="input select">
      <option
        v-for="category in categories"
        :key="category.code"
        :value="category.code"
      >
        {{ category.name }}
      </option>
    </select>
    <span>&nbsp;</span>

    <label for="inputName" class="label-required">Subcategory</label>
    <input
      id="inputName"
      v-model="form.name"
      placeholder="Enter subcategory name"
      class="input"
      @change="$v.form.name.$touch()"
    />
    <span v-if="!$v.form.name.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.name.required" class="error"
        >The name is required.</span
      ><span v-else-if="!$v.form.name.uniqueNames" class="error"
        >This subcategory already exists.</span
      ></span
    >

    <edit-object-modal-bottom-part
      :form="form"
      which="subcategories"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'

export default {
  name: 'NewSubcategory',
  components: { EditObjectModalBottomPart },
  mixins: [validationMixin],
  validations: {
    form: {
      name: {
        required,
        uniqueNames(value) {
          return !this.uniqueNames.includes(value.trim().toLowerCase())
        },
      },
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
    item() {
      return this.$store.state.currentItemToBeEdited
    },
    categories() {
      const x = JSON.parse(
        JSON.stringify(this.$store.getters.getItems('categories'))
      )
      return x.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    subcategories() {
      return this.$store.getters.getItems('subcategories')
    },
    uniqueNames() {
      return this.subcategories.map((el) => {
        return el.code !== this.form.code ? el.name.toLowerCase() : ''
      })
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.item))
  },
  mounted() {
    document.getElementById('inputName').focus()
  },
  methods: {},
}
</script>
