<template>
  <div
    class="bg-white w-11/12 md:w-auto rounded-sm border border-blue-600 shadow-xl p-4 mb-20 flex flex-col"
  >
    <h5
      class="text-2xl text-blue-600 font-bold text-center mb-4"
      style="font-family: 'Poppins'"
    >
      saqsini<i class="far fa-comments fa-fw ml-1"></i>
    </h5>

    <input
      v-model="email"
      placeholder="email"
      class="input-login mb-2"
      @keyup="$v.email.$touch"
    />
    <input
      v-model="password"
      placeholder="password"
      class="input-login mb-2"
      type="password"
      @keyup="$v.password.$touch"
    />
    <button
      class="bg-blue-600 text-white py-1 rounded-sm hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:bg-blue-600"
      :disabled="$v.$invalid || inProgress"
      @click="attemptLogin"
    >
      Login
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
  @apply border border-gray-300 rounded-sm px-3 py-2 focus:bg-gray-100 focus:border-blue-600 transition duration-500;
}
</style>
