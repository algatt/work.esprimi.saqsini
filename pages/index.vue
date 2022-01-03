<template>
  <div
    class="flex flex-col bg-gradient-to-br from-blue-600 to-blue-900 min-h-screen"
  >
    <div class="w-full flex items-center justify-end px-10 py-5">
      <div
        class="text-white text-lg border-2 border-white px-2 py-1 rounded hover:text-blue-600 hover:bg-white transition duration-300"
      >
        <nuxt-link v-if="!isLoggedIn" :to="{ name: 'login' }">login</nuxt-link
        ><nuxt-link v-else :to="{ name: 'surveys' }">home</nuxt-link>
      </div>
    </div>

    <div class="w-full text-white flex flex-wrap justify-center mt-5 mb-14">
      <h1>Saqsini <i class="far fa-comments fa-fw"></i></h1>
    </div>

    <div
      class="w-11/12 md:w-10/12 lg:w-8/12 mx-auto rounded flex flex-wrap bg-gray-100 shadow-lg border-2 p-5 mb-14"
    >
      <div class="w-full md:w-6/12 flex flex-col p-5 space-y-5">
        <div class="w-full flex justify-center">
          <h3 class="tracking-wide">Build Surveys</h3>
        </div>
        <img :src="image1" class="w-64 h-32 mx-auto" />
        <p class="text-xl">
          Saqsini allows you to build unlimited surveys, with unlimited
          responses for each survey.
        </p>
      </div>

      <div class="w-full md:w-6/12 flex flex-col p-5 space-y-5">
        <div class="w-full flex justify-center">
          <h3 class="tracking-wide">Multiple Question Types</h3>
        </div>
        <img :src="image2" class="w-64 h-32 mx-auto" />
        <p class="text-xl">
          You can create different type of questions like multiple choice,
          likert, drop-down, radio grid, and others to get the best responses.
        </p>
      </div>

      <div class="w-full md:w-6/12 flex flex-col p-5 space-y-5">
        <div class="w-full flex justify-center">
          <h3 class="tracking-wide">Visualise your responses</h3>
        </div>
        <img :src="image3" class="w-64 h-32 mx-auto" />
        <p class="text-xl">
          Multiple visualisations for each question and every individual
          response.
        </p>
      </div>

      <div class="w-full md:w-6/12 flex flex-col p-5 space-y-5">
        <div class="w-full flex justify-center">
          <h3 class="tracking-wide">Contact List</h3>
        </div>
        <img :src="image4" class="w-64 h-32 mx-auto" />
        <p class="text-xl">
          You can also manage your own contact lists, so that you can re-invite
          your contacts or intelligently invite according to survey.
        </p>
      </div>
    </div>

    <div
      class="w-11/12 md:w-10/12 lg:w-8/12 mx-auto rounded flex flex-wrap bg-gray-100 shadow-lg border-2 p-5 mb-14"
    >
      <div class="w-full flex justify-center">
        <h2 class="tracking-wide">Trusted By</h2>
      </div>
      <div class="w-full flex flex-wrap items-center justify-around">
        <div class="w-full md:w-6/12 flex justify-center">
          <img
            :src="imageEsprimi"
            class="w-48 h-62 filter grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
            @click="goto('https://www.esprimi.eu')"
          />
        </div>
        <div class="w-full md:w-6/12 flex justify-center">
          <img
            :src="imageRichmond"
            class="w-48 h-60 filter grayscale hover:grayscale-0 transition duration-300 cursor-pointer"
            @click="goto('https://www.richmond.org.mt')"
          />
        </div>
      </div>
    </div>

    <div
      class="w-11/12 md:w-10/12 lg:w-8/12 mx-auto rounded flex flex-wrap bg-gray-100 shadow-lg border-2 p-5 mb-14"
    >
      <div class="w-full flex justify-center mb-4">
        <h2 class="tracking-wide">Register Now!</h2>
      </div>

      <div class="w-full flex flex-wrap mb-6 px-10">
        <p>
          All you need to register is an email address, and you can start using
          our services immediately. Our survey builder comes at no cost, it is
          offered as a free service.
        </p>
      </div>

      <div class="w-full flex flex-col justify-center items-center space-y-5">
        <l-input v-model="name" class="w-64">Your Name</l-input>
        <l-input v-model="email" class="w-64" type="email"
          >Email Address</l-input
        >

        <l-button :disabled="!enableRegister || $v.$invalid" @click="register"
          >Register</l-button
        >
      </div>
    </div>

    <div
      class="w-11/12 md:w-10/12 lg:w-8/12 mx-auto rounded flex flex-wrap bg-gray-600 shadow-lg border-2 border-gray-700 p-5 mb-14"
    >
      <div class="w-full md:w-6/12 flex flex-col text-white p-10 space-y-5">
        <h5>LobesLab Ltd</h5>
        <div class="flex items-center space-x-3">
          <a href="https://www.lobeslab.com/"
            ><i class="fas fa-home fa-fw fa-lg"></i
          ></a>
          <a href="https://www.facebook.com/lobeslab"
            ><i class="fab fa-facebook fa-fw fa-lg"></i
          ></a>
          <a href="https://twitter.com/LabLobes"
            ><i class="fab fa-twitter fa-fw fa-lg"></i
          ></a>
          <a href="https://www.linkedin.com/company/lobeslab"
            ><i class="fab fa-linkedin fa-fw fa-lg"></i
          ></a>
        </div>
        <h6>Support</h6>
        <a href="mailto:hello@lobeslab.com"
          ><i class="far fa-envelope fa-fw mr-2"></i> hello@lobeslab.com</a
        >
        <p><i class="fas fa-phone-alt fa-fw mr-2"></i>+356 2247 0721</p>
        <p><i class="far fa-clock fa-fw mr-2"></i>Mon-Fri: 8:00 AM – 5:00 PM</p>
      </div>
      <div
        class="w-full md:w-6/12 flex flex-col text-white p-10 space-y-5 items-center md:items-end"
      >
        <p>
          <i class="fas fa-map-marked-alt fa-fw mr-2"></i> 160, Mdina Road,
          Zebbug, Malta ZBG 9015
        </p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3232.8824933976766!2d14.441305115208891!3d35.876396380149274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x130e4f90ad83911b%3A0x4ce46c5219b5a90e!2sBusiness%20Leaders%20Malta!5e0!3m2!1sen!2smt!4v1596542530511!5m2!1sen!2smt"
          allowfullscreen="allowfullscreen"
          aria-hidden="false"
          tabindex="0"
          style="border: 0px none"
          width="350"
          height="250"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import image1 from '@/assets/images/front_page_survey.svg'
import image2 from '@/assets/images/front_page_questions.svg'
import image3 from '@/assets/images/front_page_analysis.svg'
import image4 from '@/assets/images/front_page_contacts.svg'
import imageEsprimi from '@/assets/images/esprimi.png'
import imageRichmond from '@/assets/images/richmond.png'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
  components: {},
  layout: 'default',
  mixins: [validationMixin],
  data() {
    return {
      image1,
      image2,
      image3,
      image4,
      imageEsprimi,
      imageRichmond,
      name: '',
      email: '',
      enableRegister: true,
    }
  },
  validations: {
    name: {
      required,
    },
    email: {
      required,
      email,
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.authUser
    },
  },
  methods: {
    goto(url) {
      window.location.href = url
    },
    register() {
      this.$store
        .dispatch('auth/register', {
          email: this.email,
          name: this.name,
        })
        .then(() => {
          this.$toasted.show('Account created successfully. Check your inbox.')
          this.enableRegister = false
        })
        .catch((error) => {
          this.$toasted.error(error.response.data.message)
        })
    },
  },
}
</script>
