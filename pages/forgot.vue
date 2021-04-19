<template>
  <div
    class="bg-white flex flex-col px-8 md:px-16 py-5 rounded shadow-lg items-center space-y-5"
    style="max-width: 350px"
  >
    <text-link>
      <h4 class="text-primary">
        <nuxt-link to="/">
          saqsini<i class="far fa-comments fa-fw ml-1"></i>
        </nuxt-link></h4
    ></text-link>

    <p>
      Type in your email and we'll send you an email to reset your password.
    </p>

    <input-base
      id="email"
      v-model="email"
      @keyup="$v.email.$touch"
    ></input-base>

    <button-animated :disabled="$v.$invalid" @click="resetPassword"
      >Reset Password<template v-slot:icon
        ><i class="fas fa-spinner fa-fw animate-spin"></i></template
    ></button-animated>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import TextLink from '~/components/elements/TextLink'

import ButtonAnimated from '~/components/elements/ButtonAnimated'
export default {
  name: 'Reset',
  components: { TextLink, ButtonAnimated },
  layout: 'defaultLogin',
  mixins: [validationMixin],
  data() {
    return {
      email: '',
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
    },
  },
}
</script>
