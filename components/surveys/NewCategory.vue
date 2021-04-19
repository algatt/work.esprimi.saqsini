<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-2">
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
        >Category Name</input-base
      >
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
