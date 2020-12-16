<template>
  <div
    class="bg-white w-11/12 md:w-auto rounded border border-primary shadow-xl py-4 px-10 mb-20 flex flex-col"
  >
    <h5 class="text-2xl text-primary font-bold text-center mb-4">
      saqsini<i class="far fa-comments fa-fw ml-1"></i>
    </h5>

    <label class="mb-1 font-semibold" for="email">Email</label>

    <input
      id="email"
      v-model="email"
      class="input-login mb-3"
      @keyup="$v.email.$touch"
    />

    <label for="password" class="mb-1 font-semibold">Password</label>
    <input
      id="password"
      v-model="password"
      class="input-login mb-3"
      type="password"
      @keyup="$v.password.$touch"
    />
    <button
      class="btn-primary my-3"
      :disabled="$v.$invalid || inProgress"
      @click="attemptLogin"
    >
      <span v-if="!inProgress">Login</span>
      <span v-else
        ><i class="fas fa-spinner fa-fw animate-spin"></i> Logging In</span
      >
    </button>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
export default {
  name: 'LoginVue',
  layout: 'defaultLogin',
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
          this.$router.push('surveys')
        })
        .catch(() => {
          this.$toasted.error('Invalid Credentials', {
            position: 'bottom-center',
          })
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
