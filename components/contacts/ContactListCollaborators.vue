<template>
  <div class="flex flex-col w-full space-y-7">
    <l-input-button
      id="inputEmail"
      v-model="email"
      class="flex flex-1"
      type="email"
      button-color="green"
      :button-disabled="$v.$invalid"
      @blur="$v.email.$touch()"
      @click="addCollaborator"
    >
      <template v-slot:label>Collaborator's Email</template>
      <template> <i class="fas fa-check fa-fw"></i></template
    ></l-input-button>

    <div v-if="filteredCollaborators.length !== 0" class="flex flex-col">
      <p class="font-semibold mb-3">Existing Collaborators</p>

      <div
        v-for="collab in filteredCollaborators"
        :key="collab.account.code"
        class="flex justify-between items-center rounded py-3 border border-gray-100 shadow w-full my-1"
      >
        <div class="flex flex-col px-5">
          <p>{{ collab.account.displayName }}</p>
          <p>{{ collab.account.email }}</p>
        </div>
        <div class="flex items-center pr-3">
          <l-button-circle
            color="red"
            @click="removeCollaborator(collab.account.email)"
            ><i class="far fa-trash-alt fa-fw"></i
          ></l-button-circle>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import LButtonCircle from '~/components/LButtonCircle'

export default {
  name: 'ContactListCollaborators',
  components: {
    LButtonCircle,
  },
  mixins: [validationMixin],
  props: {
    dataItem: {
      required: true,
      type: Object,
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
  created() {
    this.form = JSON.parse(JSON.stringify(this.dataItem))
    this.$store
      .dispatch('contactlist/getCollaborators', this.form.code)
      .then((response) => {
        this.collaborators = response
      })
  },
  mounted() {
    document.getElementById('inputEmail').focus()
  },

  methods: {
    addCollaborator() {
      this.$store
        .dispatch('contactlist/addCollaborator', {
          code: this.form.code,
          email: this.email,
        })
        .then(() => {
          this.$store
            .dispatch('contactlist/getCollaborators', this.form.code)
            .then((response) => {
              this.collaborators = response
            })
          this.email = ''
          this.$toasted.show('Collaborator invited.')
          this.$v.email.$model = null
          this.$forceUpdate()
        })
        .catch(() => {
          this.$toasted.error('There was a problem with this email invite.')
        })
    },
    removeCollaborator(email) {
      this.$store
        .dispatch('contactlist/removeCollaborator', {
          code: this.form.code,
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
