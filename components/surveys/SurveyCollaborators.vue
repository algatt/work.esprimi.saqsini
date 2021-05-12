<template>
  <div class="flex flex-col w-full space-y-5">
    <l-input-button v-model="email" type="email" @blur="$v.email.$touch()">
      <template v-slot:label>Collaborator Email</template>

      <button-for-input
        text-colour="green"
        :disabled="$v.$invalid"
        @click="addCollaborator"
      >
        <i class="fas fa-check fa-fw"></i>
      </button-for-input>
    </l-input-button>

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
          <l-button-circle
            color="red"
            @click="removeCollaborator(item.account.email)"
          >
            <i class="far fa-trash-alt fa-fw fa-sm"></i>
          </l-button-circle>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import ButtonForInput from '~/components/elements/ButtonForInput'
import LButtonCircle from '~/components/LButtonCircle'

export default {
  name: 'SurveyCollaborators',
  components: {
    LButtonCircle,

    ButtonForInput,
  },
  mixins: [validationMixin],
  props: {
    dataItem: {
      type: Object,
      required: true,
    },
  },
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
    filteredCollaborators() {
      return this.collaborators.filter((el) => {
        return el.account.email !== this.$store.state.auth.authUser.email
      })
    },
  },
  mounted() {
    this.form = JSON.parse(JSON.stringify(this.dataItem))
    this.$store
      .dispatch('surveys/getCollaborators', this.dataItem.code)
      .then((response) => {
        this.collaborators = response
      })
  },
  methods: {
    addCollaborator() {
      this.$store
        .dispatch('surveys/addCollaborator', {
          code: this.dataItem.code,
          email: this.email,
        })
        .then(() => {
          this.$store
            .dispatch('surveys/getCollaborators', this.dataItem.code)
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
          code: this.dataItem.code,
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
