<template>
  <div
    class="bg-white w-auto rounded border border-primary shadow-xl py-4 px-14 mb-20 flex flex-col space-y-5"
  >
    <nuxt-link to="/" class="text-2xl text-primary font-bold text-center">
      saqsini<i class="far fa-comments fa-fw ml-1"></i>
    </nuxt-link>

    <p>
      Type in your email and we'll send you an email to reset your password.
    </p>

    <input
      id="email"
      v-model="email"
      class="input-login mb-3"
      @keyup="$v.email.$touch"
    />

    <div class="flex justify-center">
      <button
        class="btn-primary py-2 px-5"
        :disabled="$v.$invalid || inProgress"
        @click="resetPassword"
      >
        Reset Password
      </button>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
export default {
  name: 'Reset',
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
          }, 5000)
        })
        .catch(() => {
          this.$toasted.error('There was a problem with your request.', {
            position: 'bottom-center',
          })
          this.inProgress = false
          this.email = ''
        })
    },
  },
}
</script>

<style scoped>
.input-login {
  @apply border-2 border-gray-200 rounded-sm px-3 py-1 focus:bg-gray-100 focus:border-primary transition duration-300 ring-offset-2 focus:outline-none;
}
</style>
