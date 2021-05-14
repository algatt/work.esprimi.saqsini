<template>
  <div class="login-dialog">
    <app-logo></app-logo>

    <p>
      Type in your email and we'll send you an email to reset your password.
    </p>

    <l-input
      id="email"
      v-model="email"
      class="w-full"
      @keyup="$v.email.$touch"
    ></l-input>

    <l-button :disabled="$v.$invalid" class="w-full" @click="resetPassword"
      >Reset Password<template v-slot:rightIcon
        ><i v-if="inProgress" class="fas fa-spinner fa-fw animate-spin"></i>
        <i v-else class="far fa-thumbs-up fa-fw"></i></template
    ></l-button>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import AppLogo from '~/components/elements/AppLogo'
export default {
  name: 'Reset',
  components: { AppLogo },
  layout: 'defaultLogin',
  mixins: [validationMixin],
  data() {
    return {
      email: '',
      inProgress: false,
    }
  },
  validations: {
    email: {
      required,
      email,
    },
  },
  mounted() {
    document.addEventListener('keydown', this.eventAttempReset)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.eventAttempReset)
  },
  methods: {
    eventAttempReset(key) {
      if (key.key === 'Enter' && !this.$v.$invalid) {
        this.resetPassword()
      }
    },
    resetPassword() {
      this.inProgress = true
      this.$store
        .dispatch('auth/resetPassword', this.email)
        .then(() => {
          this.$toasted.show(
            'If the account exists you shall shortly receive an email with instructions.',
            { position: 'bottom-center' }
          )
          window.setTimeout(() => {
            this.$router.push('/login')
          }, 4000)
        })
        .catch(() => {
          this.$toasted.error('There was a problem with your request.', {
            position: 'bottom-center',
          })
          this.email = ''
        })
        .finally(() => {
          this.inProgress = false
        })
    },
  },
}
</script>
