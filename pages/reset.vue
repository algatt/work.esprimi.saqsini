<template>
  <div class="login-dialog">
    <app-logo></app-logo>

    <l-input
      id="password"
      v-model="password"
      type="password"
      @keyup="$v.password.$touch"
      >Password</l-input
    >

    <l-input
      id="passwordConfirm"
      v-model="passwordConfirm"
      type="password"
      @keyup="$v.passwordConfirm.$touch"
      >Confirm Password</l-input
    >

    <l-button :disabled="$v.$invalid || inProgress" @click="resetPassword">
      Reset Password
      <template v-slot:rightIcon>
        <i v-if="inProgress" class="fas fa-spinner fa-fw animate-spin"></i>
        <i v-else class="far fa-thumbs-up fa-fw"></i
      ></template>
    </l-button>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, sameAs } from 'vuelidate/lib/validators'
import AppLogo from '~/components/elements/AppLogo'
export default {
  name: 'Reset',
  components: { AppLogo },
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
