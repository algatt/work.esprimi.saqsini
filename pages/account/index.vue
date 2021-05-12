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
        <l-button
          :disabled="avatarImage === ''"
          class="mt-5"
          @click="resetImage"
          >Reset</l-button
        >
      </div>
      <div class="flex flex-col p-5 w-full xl:w-8/12">
        <l-input id="inputName" v-model="displayName">Display Name</l-input>
        <l-input id="inputEmail" v-model="email">Email</l-input>
      </div>

      <div class="w-full flex p-3 justify-center mb-4">
        <l-button :disabled="$v.$invalid" @click="updateDetails"
          >Update Details<template v-slot:rightIcon
            ><i class="fas fa-save fa-fw fa-sm"></i></template
        ></l-button>
      </div>
      <div class="w-full flex p-3 justify-center bg-red-100">
        <l-button color="red" @click="showConfirm = true"
          >Delete Account<template v-slot:rightIcon
            ><i class="fas fa-exclamation-triangle fa-sm fa-fw"></i></template
        ></l-button>
      </div>
    </div>

    <div
      v-if="showConfirm"
      class="fixed top-0 left-0 w-full h-full frosted flex items-center justify-center"
    >
      <div
        class="bg-white border border-gray-200 shadow-md flex flex-col p-5 space-y-5"
      >
        <h5 class="text-primary">Deleting Account</h5>
        <p>
          If you delete your account, all your work will be lost and cannot be
          recovered.
        </p>
        <p>
          if you are sure input your email below to confirm and press Delete.
        </p>
        <l-input
          v-model="confirmEmail"
          placeholder="confirm your email"
        ></l-input>

        <div class="flex justify-between w-full">
          <l-button @click="showConfirm = false"
            >Cancel<template v-slot:rightIcon
              ><i class="fas fa-times fa-fw fa-sm"></i></template
          ></l-button>
          <l-button
            color="red"
            :disabled="confirmEmail !== accountDetails.email"
            @click="logoutUser"
            >Delete Account<template v-slot:rightIcon
              ><i class="fas fa-exclamation-triangle fa-fw fa-sm"></i></template
          ></l-button>
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

export default {
  name: 'AccountDetails',
  components: { Spinner },
  mixins: [validationMixin],
  data() {
    return {
      loading: true,
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
    accountAvatar() {
      return this.$store.state.auth.authUserAvatar
    },
    accountDetails() {
      return this.$store.state.auth.authUser
    },
  },
  created() {
    this.loading = true
    this.$store
      .dispatch('auth/getUserAvatar')
      .then(() => {
        if (this.accountAvatar && this.accountAvatar !== '')
          this.avatarImage = this.accountAvatar
        this.displayName = this.accountDetails.displayName
        this.email = this.accountDetails.email
        this.loading = false
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
