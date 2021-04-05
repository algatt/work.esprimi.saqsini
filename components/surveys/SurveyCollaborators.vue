<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
      <input-base-with-button
        v-model="email"
        type="email"
        @blur="$v.email.$touch()"
      >
        Collaborator Email
        <template v-slot:button>
          <button-for-input :disabled="$v.$invalid" @click="addCollaborator">
            <i class="fas fa-check fa-fw"></i> </button-for-input
        ></template>
      </input-base-with-button>

      <div v-if="filteredCollaborators.length !== 0" class="flex flex-col">
        <label class="font-semibold mb-2">Existing Collaborators</label>

        <div
          v-for="item in filteredCollaborators"
          :key="item.account.code"
          class="flex justify-between items-center rounded py-3 border border-gray-100 shadow w-full my-1"
        >
          <div class="flex flex-col px-5">
            <p>{{ item.account.displayName }}</p>
            <p>{{ item.account.email }}</p>
          </div>
          <div class="flex items-center pr-3">
            <button-icon-rounded-outline
              bg-colour="red"
              @click="removeCollaborator(item.account.email)"
            >
              <i class="far fa-trash-alt fa-fw fa-sm"></i>
            </button-icon-rounded-outline>
          </div>
        </div>
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
import InputBaseWithButton from '~/components/elements/InputBaseWithButton'
import ButtonForInput from '~/components/elements/ButtonForInput'
import ButtonIconRoundedOutline from '~/components/elements/ButtonIconRoundedOutline'

export default {
  name: 'SurveyCollaborators',
  components: {
    ButtonIconRoundedOutline,
    InputBaseWithButton,
    EditObjectModalBottomPart,
    ButtonForInput,
  },
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
