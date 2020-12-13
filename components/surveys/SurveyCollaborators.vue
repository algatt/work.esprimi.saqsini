<template>
  <div class="flex flex-col w-full md:w-10/12 pb-32">
    <label class="label" for="inputEmail">New Collaborator</label>
    <div class="flex items-center w-full space-x-3">
      <input
        id="inputEmail"
        v-model="email"
        class="input w-8/12"
        type="email"
        @blur="$v.email.$touch()"
      />
      <button
        class="btn-link w-24"
        :disabled="$v.$invalid"
        @click="addCollaborator"
      >
        Add
      </button>
    </div>
    <template v-if="$v.$error">
      <span v-if="$v.email.required" class="error"> Email is required. </span>
      <span v-else-if="$v.email.email" class="error"> Not a valid email. </span>
    </template>
    <span v-else class="error">&nbsp;</span>
    {{ survey }}

    <edit-object-modal-bottom-part
      :form="form"
      which="surveys"
      :is-valid="true"
      :show-delete="false"
      :show-save="false"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'

export default {
  name: 'SurveyCollaborators',
  components: { EditObjectModalBottomPart },
  mixins: [validationMixin],
  data() {
    return {
      form: null,
      email: null,
    }
  },
  validations: {
    email: {
      required,
      email,
    },
  },
  computed: {
    survey() {
      return this.$store.state.currentItemToBeEdited
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.survey))
  },
  methods: {
    addCollaborator() {
      this.$store
        .dispatch('surveys/addCollaborator', {
          code: this.survey.code,
          email: this.email,
        })
        .then(() => {
          this.$toasted.show('Collaborator invited.')
        })
        .catch(() => {
          this.$toasted.error('There was a problem with this email invite.')
        })
    },
  },
}
</script>
