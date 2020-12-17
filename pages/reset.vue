<template>
  <div
    class="bg-white w-auto rounded border border-primary shadow-xl py-4 px-14 mb-20 flex flex-col"
  >
    <nuxt-link to="/" class="text-2xl text-primary font-bold text-center mb-4">
      saqsini<i class="far fa-comments fa-fw ml-1"></i>
    </nuxt-link>

    <label class="mb-1 font-semibold" for="password">Password</label>

    <input
      id="password"
      v-model="password"
      class="input-login mb-3"
      type="password"
      @keyup="$v.password.$touch"
    />

    <label class="mb-1 font-semibold" for="password">Confirm Password</label>

    <input
      id="passwordConfirm"
      v-model="passwordConfirm"
      class="input-login mb-3"
      type="password"
      @keyup="$v.passwordConfirm.$touch"
    />

    <button
      class="btn-primary my-3 py-2"
      :disabled="$v.$invalid || inProgress"
      @click="resetPassword"
    >
      Confirm Password
    </button>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, sameAs } from 'vuelidate/lib/validators'
export default {
  name: 'Reset',
  layout: 'defaultLogin',
  mixins: [validationMixin],
  data() {
    return {
      password: '',
      passwordConfirm: '',
      inProgress: false,
    }
  },
  validations: {
    password: {
      required,
    },
    passwordConfirm: {
      required,
      sameAsPassword: sameAs('password'),
    },
  },
  mounted() {
    document.addEventListener('keydown', this.eventResetPassword)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.eventResetPassword)
  },
  methods: {
    eventResetPassword(key) {
      if (key.key === 'Enter' && !this.$v.$invalid) {
        this.resetPassword()
      }
    },
    resetPassword() {
      this.inProgress = true
      this.$store
        .dispatch('auth/setPassword', {
          email: this.$route.query.email,
          token: this.$route.query.token,
          password: this.password,
        })
        .then(() => {
          this.$toasted.show(
            'Password resetted successfully, you will now be logged in...',
            { position: 'bottom-center' }
          )
          window.setTimeout(() => {
            this.$store
              .dispatch('auth/loginWithEmailAndPassword', {
                email: this.$route.query.email,
                password: this.password,
              })
              .then(() => {
                this.$router.push('surveys')
              })
          }, 5000)
        })
        .catch(() => {
          this.$toasted.error('There was a problem with your request.', {
            position: 'bottom-center',
          })
          this.inProgress = false
          this.password = ''
          this.passwordConfirm = ''
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
