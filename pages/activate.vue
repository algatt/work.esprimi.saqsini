<template>
  <div v-if="!loading" class="login-dialog">
    <app-logo></app-logo>

    <template v-if="!emailRoute || !tokenRoute || !activated">
      <p>
        Oh no! We have a problem with this link. Click below so we send you
        another email.
      </p>

      <l-input id="email" v-model="email" type="email" class="w-full"
        >Email</l-input
      >

      <l-button :disabled="$v.$invalid" class="w-full" @click="sendAnotherToken"
        >Send Another Token<template v-slot:rightIcon
          ><i v-if="inProgress" class="fas fa-spinner fa-fw animate-spin"></i>
          <i v-else class="fas fa-ticket-alt fa-fw"></i></template
      ></l-button>
    </template>

    <template v-else>
      <l-input id="password" v-model="password" type="password"
        >Password</l-input
      >

      <l-button :disabled="$v.$invalid" @click="setPassword"
        >Set Password<template v-slot:rightIcon
          ><i v-if="inProgress" class="fas fa-spinner fa-fw animate-spin"></i>
          <i v-else class="far fa-thumbs-up fa-fw"></i></template
      ></l-button>
    </template>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email, required, minLength } from 'vuelidate/lib/validators'
import AppLogo from '~/components/elements/AppLogo'

export default {
  name: 'ActivateVue',
  layout: 'defaultLogin',
  components: { AppLogo },
  mixins: [validationMixin],
  data() {
    return {
      email: '',
      password: '',
      activated: false,
      loading: true,
      inProgress: false,
    }
  },
  computed: {
    emailRoute() {
      const email = this.$route.query.email
      return email === undefined ? false : email
    },
    tokenRoute() {
      const token = this.$route.query.token
      return token === undefined ? false : token
    },
  },
  validations() {
    return {
      validEmailOrPassword() {
        if (!this.emailRoute || !this.tokenRoute) {
          return email(this.email) && required(this.email)
        } else {
          return required(this.password) && minLength(this.password, 6)
        }
      },
    }
  },
  created() {
    this.$store
      .dispatch('auth/activateUser', {
        email: this.emailRoute,
        token: this.tokenRoute,
      })
      .then(() => {
        this.activated = true
      })
      .catch(() => {
        this.activated = false
      })
      .finally(() => {
        this.loading = false
      })
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
    sendAnotherToken() {
      this.inProgress = true
      this.$store
        .dispatch('auth/resendToken', { email: this.email })
        .then(() => {
          this.$toasted.show(
            'If we find your email, we will send you an email with new details.'
          )
          this.inProgress = false
        })
        .catch(() => {
          this.$toasted.show('There was a problem with resending the token.')
          window.setTimeout(() => {
            this.$router.push('/login')
          }, 4000)
        })
    },
    setPassword() {
      this.$store
        .dispatch('auth/setPassword', {
          token: this.tokenRoute,
          email: this.emailRoute,
          password: this.password,
        })
        .then(() => {
          this.$toasted.show(
            'Password changed successfully. You will be logged in automatically.',
            { duration: 5000 }
          )
          setTimeout(() => {
            this.$store
              .dispatch('auth/loginWithEmailAndPassword', {
                email: this.emailRoute,
                password: this.password,
              })
              .then(() => {
                this.$router.push({ name: 'index' })
              })
              .catch(() => {
                this.$toasted.show(
                  'There was a problem logging you in. Try logging in manually.'
                )
              })
          }, 5000)
        })
        .catch(() => {
          this.$toasted.show(
            'There was a problem with setting up the password.'
          )
          window.setTimeout(() => {
            this.$router.push('/login')
          }, 4000)
        })
    },
  },
}
</script>
