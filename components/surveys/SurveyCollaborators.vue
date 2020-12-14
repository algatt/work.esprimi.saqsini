<template>
  <div class="flex flex-col w-full md:w-10/12 pb-32">
    <label class="label">New Collaborator</label>
    <div
      class="flex justify-between items-center rounded py-3 border border-gray-100 shadow w-full md:w-10/12 my-1"
    >
      <div class="flex flex-col flex-grow px-3">
        <input
          id="inputEmail"
          v-model="email"
          type="email"
          class="input"
          @blur="$v.email.$touch()"
        />
      </div>
      <div class="flex items-center pr-3">
        <button
          class="btn-link-primary"
          :disabled="$v.$invalid"
          @click="addCollaborator"
        >
          <i class="fas fa-check fa-sm fa-fw"></i>
        </button>
      </div>
    </div>

    <label class="label mt-3">Existing Collaborators</label>
    <div
      v-for="item in filteredCollaborators"
      :key="item.account.code"
      class="flex justify-between items-center rounded py-3 border border-gray-100 shadow w-full md:w-10/12 my-1"
    >
      <div class="flex flex-col px-3">
        <p>{{ item.account.displayName }}</p>
        <p>{{ item.account.email }}</p>
      </div>
      <div class="flex items-center pr-3">
        <button
          class="btn-link-danger"
          @click="removeCollaborator(item.account.email)"
        >
          <i class="far fa-trash-alt fa-fw fa-sm"></i>
        </button>
      </div>
    </div>

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
      collaborators: [],
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
    filteredCollaborators() {
      return this.collaborators.filter((el) => {
        return el.account.email !== this.$store.state.auth.authUser.email
      })
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.survey))
    this.$store
      .dispatch('surveys/getCollaborators', this.survey.code)
      .then((response) => {
        this.collaborators = response
      })
  },
  methods: {
    addCollaborator() {
      this.$store
        .dispatch('surveys/addCollaborator', {
          code: this.survey.code,
          email: this.email,
        })
        .then(() => {
          this.$store
            .dispatch('surveys/getCollaborators', this.survey.code)
            .then((response) => {
              this.collaborators = response
            })
          this.email = ''
          this.$toasted.show('Collaborator invited.')
        })
        .catch(() => {
          this.$toasted.error('There was a problem with this email invite.')
        })
    },
    removeCollaborator(email) {
      this.$store
        .dispatch('surveys/removeCollaborator', {
          code: this.survey.code,
          email,
        })
        .then(() => {
          this.$toasted.show(`${email} removed from collaborator.`)
          this.collaborators = this.collaborators.filter((el) => {
            return el.account.email !== email
          })
        })
        .catch(() => {
          this.$toasted.error(
            'There was a problem with removing this collaborator.'
          )
        })
    },
  },
}
</script>
