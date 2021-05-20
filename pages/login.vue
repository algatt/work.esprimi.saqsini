<template>
  <form class="login-dialog" @submit.prevent>
    <app-logo></app-logo>

    <PButton></PButton>
    <l-input v-model="email" @keyup="$v.email.$touch">Email</l-input>

    <l-input v-model="password" type="password" @keyup="$v.password.$touch"
      >Password</l-input
    >

    <l-button :disabled="$v.$invalid" @click="attemptLogin"
      >Login<template v-slot:rightIcon
        ><i v-if="inProgress" class="fas fa-spinner fa-fw animate-spin"></i>
        <i v-else class="fas fa-sign-in-alt fa-fw"></i></template
    ></l-button>

    <l-text-link>
      <nuxt-link :to="{ name: 'forgot' }"
        >Forgot Password</nuxt-link
      ></l-text-link
    >
  </form>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import { LButton as PButton } from '@alanlobeslab/lobeslab'

import AppLogo from '~/components/elements/AppLogo'
import LTextLink from '~/components/LTextLink'
export default {
  name: 'LoginPage',
  components: { LTextLink, AppLogo, PButton },
  layout: 'defaultLogin',
  middleware: 'auth',
  mixins: [validationMixin],
  data() {
    return {
      email: '',
      password: '',
      inProgress: false,
    }
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  mounted() {
    document.addEventListener('keydown', this.eventAttemptLogin)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.eventAttemptLogin)
  },
  methods: {
    eventAttemptLogin(key) {
      if (key.key === 'Enter' && !this.$v.$invalid) {
        this.attemptLogin()
      }
    },
    attemptLogin() {
      this.inProgress = true
      this.$store
        .dispatch('auth/loginWithEmailAndPassword', {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: 'surveys' })
        })
        .catch(() => {
          this.$toasted.error('Invalid Credentials')
        })
        .finally(() => {
          this.inProgress = false
        })
    },
  },
}
</script>
