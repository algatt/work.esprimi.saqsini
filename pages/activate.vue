<template>
  <div
    class="bg-white rounded border border-primary shadow-xl py-4 px-14 mb-20 flex flex-col flex-grow"
    style="max-width: 350px"
  >
    <h5 class="text-2xl text-primary font-bold text-center mb-4">
      saqsini<i class="far fa-comments fa-fw ml-1"></i>
    </h5>
    <template v-if="!emailRoute || !tokenRoute">
      <p class="mb-4">
        Oh no! We have a problem with this link. Click below so we send you
        another email.
      </p>

      <label class="mb-1 font-semibold" for="email">Email</label>
      <input id="email" v-model="email" type="email" class="input-login mb-3" />

      <button
        class="btn btn-primary my-3 py-2"
        :disabled="$v.$invalid"
        @click="sendAnotherToken"
      >
        Send Another Email
      </button>
    </template>

    <template v-else>
      <label class="mb-1 font-semibold" for="password">Password</label>

      <input
        id="password"
        v-model="password"
        type="password"
        class="input-login mb-3"
      />

      <button
        class="btn btn-primary my-3 py-2"
        :disabled="$v.$invalid || inProgress"
        @click="attemptLogin"
      >
        <span v-if="!inProgress">Set Password</span>
        <span v-else
          ><i class="fas fa-spinner fa-fw animate-spin"></i> Setting
          Password</span
        >
      </button>
    </template>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { email, required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'ActivateVue',
  layout: 'defaultLogin',
  mixins: [validationMixin],
  data() {
    return {
      email: '',
      password: '',
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
    sendAnotherToken() {},
    attemptLogin() {
      this.inProgress = true
      // this.$store
      //   .dispatch('auth/loginWithEmailAndPassword', {
      //     email: this.email,
      //     password: this.password,
      //   })
      //   .then(() => {
      //     this.$router.push('surveys')
      //   })
      //   .catch(() => {
      //     this.$toasted.error('Invalid Credentials', {
      //       position: 'bottom-center',
      //     })
      //   })
      //   .finally(() => {
      //     this.inProgress = false
      //   })
    },
  },
}
</script>

<style scoped>
.input-login {
  @apply border-2 border-gray-200 rounded-sm px-3 py-1 focus:bg-gray-100 focus:border-primary transition duration-300 ring-offset-2 focus:outline-none;
}
</style>
