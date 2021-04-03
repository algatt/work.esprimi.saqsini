<template>
  <div
    v-if="!loading"
    class="bg-white flex flex-col px-8 md:px-16 py-5 rounded shadow-lg items-center space-y-5"
    style="max-width: 350px"
  >
    <text-link>
      <h4 class="text-primary">
        <nuxt-link to="/">
          saqsini<i class="far fa-comments fa-fw ml-1"></i>
        </nuxt-link></h4
    ></text-link>

    <template v-if="!emailRoute || !tokenRoute || !activated">
      <p class="mb-4">
        Oh no! We have a problem with this link. Click below so we send you
        another email.
      </p>

      <input-base id="email" v-model="email" type="email">Email</input-base>

      <button-animated :disabled="$v.$invalid" @click="sendAnotherToken"
        ><template v-slot:icon
          ><i class="fas fa-spinner fa-fw animate-spin"></i></template
        >Send Another Token</button-animated
      >
    </template>

    <template v-else>
      <input-base id="password" v-model="password" type="password"
        >Password</input-base
      >

      <button-animated :disabled="$v.$invalid" @click="setPassword"
        ><template v-slot:icon
          ><i class="fas fa-spinner fa-fw animate-spin"></i></template
        >Set Password</button-animated
      >
    </template>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email, required, minLength } from 'vuelidate/lib/validators'
import spinner from '@/components/layouts/Spinner'
import InputBase from '~/components/elements/InputBase'
import ButtonAnimated from '~/components/elements/ButtonAnimated'

export default {
  name: 'ActivateVue',
  layout: 'defaultLogin',
  components: { ButtonAnimated, InputBase, spinner },
  mixins: [validationMixin],
  data() {
    return {
      email: '',
      password: '',
      activated: false,
      loading: true,
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
      this.$store
        .dispatch('auth/resendToken', { email: this.email })
        .then(() => {
          this.$toasted.show(
            'If we find your email, we will send you an email with new details.'
          )
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
