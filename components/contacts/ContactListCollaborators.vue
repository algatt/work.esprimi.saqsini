<template>
  <div class="frosted">
    <div
      class="check-height mx-auto bg-white rounded-none md:border md:border-gray-100 shadow-md overflow-y-auto relative w-full w-full md:w-6/12 flex flex-col justify-between"
      @click.stop
    >
      <div>
        <div class="bg-primary p-3 text-white text-lg">
          <h5 class="pl-2">Collaborators</h5>
        </div>
        <div class="flex flex-col p-5 overflow-y-auto">
          <div class="flex flex-col w-full space-y-5">
            <input-base-with-button
              id="inputEmail"
              v-model="email"
              class="flex flex-1"
              type="email"
              @blur="$v.email.$touch()"
              >Collaborator's Email
              <template v-slot:button>
                <button-for-input
                  :disabled="$v.$invalid"
                  @click="addCollaborator"
                  ><i
                    class="fas fa-check fa-fw"
                  ></i> </button-for-input></template
            ></input-base-with-button>

            <div
              v-if="filteredCollaborators.length !== 0"
              class="flex flex-col"
            >
              <p class="font-semibold mb-3">Existing Collaborators</p>

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
                    ><i class="far fa-trash-alt fa-fw"></i
                  ></button-icon-rounded-outline>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full flex justify-end p-5 px-3">
        <button-icon bg-colour="gray" @click="cancelModal">
          <template v-slot:icon
            ><i class="fas fa-times fa-fw fa-sm"></i></template
          >Cancel
        </button-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import ButtonIcon from '~/components/elements/ButtonIcon'
import InputBaseWithButton from '~/components/elements/InputBaseWithButton'
import ButtonIconRoundedOutline from '~/components/elements/ButtonIconRoundedOutline'
import ButtonForInput from '~/components/elements/ButtonForInput'

export default {
  name: 'ContactListCollaborators',
  components: {
    ButtonIconRoundedOutline,
    ButtonForInput,
    InputBaseWithButton,
    ButtonIcon,
  },
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
    const obj = document
      .getElementById('inputEmail')
      .getElementsByTagName('input')[0]
    obj.focus()
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
