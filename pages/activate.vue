<template>
  <div
    v-if="!loading"
    class="bg-white rounded border border-primary shadow-xl py-4 px-14 mb-20 flex flex-col flex-grow"
    style="max-width: 350px"
  >
    <h5 class="text-2xl text-primary font-bold text-center mb-4">
      saqsini<i class="far fa-comments fa-fw ml-1"></i>
    </h5>
    <template v-if="!emailRoute || !tokenRoute || !activated">
      <p class="mb-4">
        Oh no! We have a problem with this link. Click below so we send you
        another email.
      </p>

      <label class="mb-1 font-semibold" for="email">Email</label>
      <input id="email" v-model="email" type="email" class="input-login mb-3" />

      <button
        class="btn btn-primary my-3 py-2"
        :disabled="$v.$invalid || inProgress"
        @click="sendAnotherToken"
      >
        <span v-if="!inProgress">Request new Token</span>
        <span v-else class="flex items-center justify-center"
          ><i class="fas fa-spinner fa-fw animate-spin mr-2"></i> Request new
          Token</span
        >
      </button>
    </template>

    <template v-else>
      <label class="mb-1 font-semibold" for="password">New Password</label>

      <input
        id="password"
        v-model="password"
        type="password"
        class="input-login mb-3"
      />

      <button
        class="btn btn-primary my-3 py-2"
        :disabled="$v.$invalid || inProgress"
        @click="setPassword"
      >
        <span v-if="!inProgress">Set Password</span>
        <span v-else
          ><i class="fas fa-spinner fa-fw animate-spin"></i> Setting
          Password</span
        >
      </button>
    </template>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email, required, minLength } from 'vuelidate/lib/validators'
import spinner from '@/components/layouts/Spinner'
export default {
  name: 'ActivateVue',
  layout: 'defaultLogin',
  components: { spinner },
  mixins: [validationMixin],
  data() {
    return {
      email: '',
      password: '',
      inProgress: false,
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
      this.inProgress = true
      this.$store
        .dispatch('auth/resendToken', { email: this.email })
        .then(() => {
          this.$toasted.show(
            'If we find your email, we will send you an email with new details.'
          )
        })
        .catch(() => {
          this.$toasted.show('There was a problem with resending the token.')
        })
        .finally(() => {
          this.inProgress = false
        })
    },
    setPassword() {
      this.inProgress = true
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
        })
        .finally(() => {
          this.inProgress = false
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
