<template>
  <div v-if="!loading" class="flex flex-col ml-5 mr-auto">
    <div class="w-full mb-3">
      <h5 class="text-xl">Your Account</h5>
    </div>
    <div class="flex p-5">
      <div class="flex-none flex flex-col w-52 items-center">
        <input
          id="inputAvatar"
          type="file"
          hidden
          accept=".png,.jpeg,.jpg"
          @change="updateAvatar"
        />
        <img
          v-if="avatarImage !== ''"
          :src="avatarImage"
          class="h-48 w-48 object-cover rounded-lg cursor-pointer shadow"
          @click="activateInput"
        />
        <span
          v-else
          class="h-48 w-48 object-cover rounded-lg cursor-pointer shadow flex justify-center items-center"
          @click="activateInput"
        >
          <i class="far fa-user-circle fa-fw fa-5x text-gray-300"></i>
        </span>
        <button
          class="btn-link my-2"
          @click="
            avatarImage = ''
            imageFile = ''
          "
        >
          Clear
        </button>
      </div>
      <div class="flex flex-col pl-5">
        <label for="inputName" class="label">Display Name</label>
        <input id="inputName" v-model="displayName" class="input mb-3" />
        <label for="inputEmail" class="label">Email</label>
        <input id="inputEmail" v-model="email" class="input mb-3" />
      </div>
    </div>
    <div class="flex justify-center mt-3">
      <button
        class="btn-primary px-3"
        :disabled="$v.$invalid"
        @click="updateDetails"
      >
        Update Details
      </button>
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import Spinner from '~/components/layouts/Spinner'
export default {
  name: 'AccountDetails',
  components: { Spinner },
  mixins: [validationMixin],
  data() {
    return {
      avatarImage: '',
      imageFile: '',
      displayName: '',
      email: '',
    }
  },
  validations: {
    displayName: {
      required,
    },
    email: {
      required,
      email,
    },
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    accountAvatar() {
      return this.$store.state.auth.authUserAvatar
    },
    accountDetails() {
      return this.$store.state.auth.authUser
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    this.$store
      .dispatch('auth/getUserAvatar')
      .then(() => {
        if (this.accountAvatar && this.accountAvatar !== '')
          this.avatarImage = this.accountAvatar
        this.displayName = this.accountDetails.displayName
        this.email = this.accountDetails.email
        this.$store.dispatch('setLoading', false)
      })
      .catch(() => {})
  },
  methods: {
    activateInput() {
      document.getElementById('inputAvatar').click()
    },
    updateAvatar() {
      const t = this
      this.imageFile = document.getElementById('inputAvatar').files[0]
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        function () {
          if (reader.result.includes('data:image'))
            t.avatarImage = reader.result
          else t.avatarImage = ''
          t.$forceUpdate()
        },
        false
      )

      if (this.imageFile) {
        reader.readAsDataURL(this.imageFile)
      }
    },
    updateDetails() {
      Promise.all([
        this.$store.dispatch('auth/updateUserDetails', {
          displayName: this.displayName,
          email: this.email,
        }),
        this.imageFile === ''
          ? this.$store.dispatch('auth/clearAvatar')
          : this.$store.dispatch('auth/updateUserAvatar', this.imageFile),
      ])
        .then(() => {
          this.$toasted.show('Profile updated')
        })
        .catch(() => {
          this.$toasted.error('There was a problem updating your profile...')
        })
    },
  },
}
</script>

<style scoped></style>
