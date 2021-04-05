<template>
  <div
    class="bg-white flex flex-col px-8 md:px-16 py-5 rounded shadow-lg items-center space-y-5"
    style="max-width: 350px"
  >
    <text-link>
      <h4 class="text-primary">
        <nuxt-link to="/">
          saqsini<i class="far fa-comments fa-fw ml-1"></i
        ></nuxt-link>
      </h4>
    </text-link>

    <input-base v-model="email" @keyup="$v.email.$touch">Email</input-base>

    <input-base v-model="password" type="password" @keyup="$v.password.$touch"
      >Password</input-base
    >

    <button-animated
      bg-colour="blue"
      :disabled="$v.$invalid"
      @click="attemptLogin"
      ><template v-slot:icon
        ><i class="fas fa-spinner fa-fw animate-spin"></i></template
      >Login</button-animated
    >

    <text-link>
      <nuxt-link :to="{ name: 'forgot' }">Forgot Password</nuxt-link></text-link
    >
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import InputBase from '~/components/elements/InputBase'
import TextLink from '~/components/elements/TextLink'
import ButtonAnimated from '~/components/elements/ButtonAnimated'
export default {
  name: 'LoginVue',
  components: { TextLink, InputBase, ButtonAnimated },
  layout: 'defaultLogin',
  mixins: [validationMixin],
  data() {
    return {
      email: '',
      password: '',
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
    },
  },
}
</script>
