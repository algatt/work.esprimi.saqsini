<template>
  <div class="frosted p-0 md:p-8">
    <div
      class="check-height w-full self-start h-screen md:h-auto md:w-6/12 mx-auto flex flex-col bg-white relative rounded-none md:rounded-lg md:border md:border-gray-100 shadow-md"
      @click.stop
    >
      <div
        class="bg-primary p-3 text-white text-lg rounded-none md:rounded-t-lg"
      >
        <h5 class="pl-2">Collaborators</h5>
      </div>
      <div class="flex flex-col p-5 overflow-y-auto">
        <div class="flex flex-col w-full space-y-5">
          <div class="flex flex-col">
            <label class="label">New Collaborator</label>
            <div class="flex justify-between items-center w-full">
              <div class="flex flex-col flex-grow pr-5">
                <input
                  id="inputEmail"
                  v-model="email"
                  type="email"
                  class="input"
                  placeholder="Enter collaborator's email"
                  @blur="$v.email.$touch()"
                />
              </div>
              <div class="flex items-center">
                <button
                  class="btn btn-primary"
                  :disabled="$v.$invalid"
                  @click="addCollaborator"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredCollaborators.length !== 0" class="flex flex-col">
            <label class="label">Existing Collaborators</label>

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
                <button
                  class="btn-link-danger"
                  @click="removeCollaborator(item.account.email)"
                >
                  <i class="far fa-trash-alt fa-fw fa-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="w-full flex justify-end mt-3">
          <button-icon
            colour="secondary"
            icon="fas fa-times"
            @click="cancelModal"
          >
            <template v-slot:text>Cancel</template>
          </button-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import ButtonIcon from '~/components/layouts/ButtonIcon'

export default {
  name: 'ContactListCollaborators',
  components: { ButtonIcon },
  mixins: [validationMixin],
  props: {
    item: {
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
    this.form = JSON.parse(JSON.stringify(this.item))
    this.$store
      .dispatch('contactlist/getCollaborators', this.form.code)
      .then((response) => {
        this.collaborators = response
      })
  },
  mounted() {
    this.$store.dispatch('emptySelectedItems')
    document.documentElement.style.overflow = 'hidden'
    document.body.scroll = 'no'
  },
  destroyed() {
    document.documentElement.style.overflow = 'visible'
    document.body.scroll = 'yes'
    this.$emit('modalClosed')
  },
  methods: {
    cancelModal() {
      this.$emit('cancel')
    },
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
