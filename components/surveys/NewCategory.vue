<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
      <div class="flex flex-col">
        <div class="flex items-center w-full">
          <label for="inputName" class="label">Category</label>
          <span v-if="$v.form.name.$error">
            <span v-if="!$v.form.name.required" class="error">required</span>
            <span v-else-if="!$v.form.name.uniqueNames" class="error"
              >this category already exists</span
            ></span
          >
        </div>
        <input
          id="inputName"
          v-model="form.name"
          placeholder="Enter category name"
          class="input"
          @change="$v.form.name.$touch()"
        />
      </div>
    </div>
    <edit-object-modal-bottom-part
      class="pt-10 pb-5"
      :form="form"
      which="categories"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'

export default {
  name: 'NewCategory',
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
      return this.$store.getters.getItems('categories')
    },
    uniqueNames() {
      return this.categories.map((el) => {
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
