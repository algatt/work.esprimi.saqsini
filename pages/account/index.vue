<template>
  <div v-if="!loading" class="flex flex-wrap pt-5">
    <div
      class="flex flex-wrap w-full xl:w-6/12 bg-gray-50 mx-auto rounded shadow border border-gray-200"
    >
      <div
        class="w-full bg-primary mb-3 rounded-t border-b border-gray-200 p-3"
      >
        <h5 class="text-white">Your Account</h5>
      </div>
      <div
        class="flex flex-col p-5 items-center justify-center w-full xl:w-4/12"
      >
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
          class="h-36 w-36 object-cover rounded-full cursor-pointer shadow"
          @click="activateInput"
        />
        <span
          v-else
          class="h-36 w-36 object-cover rounded-full cursor-pointer shadow flex justify-center items-center text-gray-300 hover:text-primary transition duration-300"
          @click="activateInput"
        >
          <i class="fas fa-user fa-fw fa-5x bg-white"></i>
        </span>
        <button
          v-if="avatarImage !== ''"
          class="btn-link mt-2"
          @click="resetImage"
        >
          Clear
        </button>
      </div>
      <div class="flex flex-col p-5 w-full xl:w-8/12">
        <label for="inputName" class="label">Display Name</label>
        <input id="inputName" v-model="displayName" class="input mb-3" />
        <label for="inputEmail" class="label">Email</label>
        <input id="inputEmail" v-model="email" class="input mb-3" />
      </div>

      <div class="w-full flex p-3 justify-center mb-4">
        <button-icon
          :disabled="$v.$invalid"
          icon="fas fa-save"
          colour="primary"
          @click="updateDetails"
          ><template v-slot:text>Update Details</template></button-icon
        >
      </div>
      <div class="w-full flex p-3 justify-center bg-red-100">
        <button-icon
          icon="fas fa-exclamation-triangle"
          colour="danger"
          @click="showConfirm = true"
          ><template v-slot:text>Delete Account</template></button-icon
        >
      </div>
    </div>

    <div
      v-if="showConfirm"
      class="fixed top-0 left-0 w-full h-full frosted flex items-center justify-center"
    >
      <div
        class="bg-white border border-gray-200 shadow-md flex flex-col p-5 space-y-5"
      >
        <h5>Deleting Account</h5>
        <p>
          If you delete your account, all your work will be lost and cannot be
          recovered.
        </p>
        <p>
          if you are sure input your email below to confirm and press Delete.
        </p>
        <input
          v-model="confirmEmail"
          class="input"
          placeholder="confirm your email"
        />
        <div class="flex justify-between w-full">
          <button-icon
            colour="primary"
            icon="fas fa-times"
            @click="showConfirm = false"
            ><template v-slot:text>Cancel</template></button-icon
          >
          <button-icon
            colour="danger"
            icon="fas fa-exclamation-triangle"
            :disabled="confirmEmail !== accountDetails.email"
            @click="logoutUser"
            ><template v-slot:text>Delete Account</template></button-icon
          >
        </div>
      </div>
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import Spinner from '~/components/layouts/Spinner'
import ButtonIcon from '~/components/layouts/ButtonIcon'
export default {
  name: 'AccountDetails',
  components: { Spinner, ButtonIcon },
  mixins: [validationMixin],
  data() {
    return {
      avatarImage: '',
      imageFile: '',
      displayName: '',
      email: '',
      showConfirm: false,
      confirmEmail: '',
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
    logoutUser() {
      this.$store.dispatch('auth/logout').then(() => {
        this.$router.push('/login')
      })
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
    resetImage() {
      this.avatarImage = ''
      this.imageFile = ''
    },
  },
}
</script>

<style scoped></style>
