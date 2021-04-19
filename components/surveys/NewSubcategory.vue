<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
      <select-base v-model="form.categoryCode">
        Category
        <template v-slot:options>
          <option
            v-for="category in categories"
            :key="category.code"
            :value="category.code"
            :selected="category.code === form.categoryCode"
          >
            {{ category.name }}
          </option>
        </template>
      </select-base>

      <input-base
        id="inputName"
        v-model="form.name"
        :error="
          $v.form.name.$model !== undefined
            ? !$v.form.name.required
              ? 'required'
              : !$v.form.name.uniqueNames
              ? 'category already in use'
              : null
            : null
        "
        @change="$v.form.name.$touch()"
        >Subcategory Name</input-base
      >
    </div>

    <edit-object-modal-bottom-part
      class="pt-10 pb-5"
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
import SelectBase from '~/components/elements/SelectBase'

export default {
  name: 'NewSubcategory',
  components: { SelectBase, EditObjectModalBottomPart },
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
