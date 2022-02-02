<template>
  <div
    class="flex flex-col bg-white min-h-screen"
    style="font-family: 'Poppins', sans-serif"
  >
    <div
      class="w-full flex items-center justify-between front-page-spacing mb-10"
    >
      <h3 class="text-blue-600">
        Saqsini <i class="far fa-comments fa-fw"></i>
      </h3>
      <div
        class="text-blue-600 text-lg border-2 border-blue-600 px-2 py-1 rounded hover:text-white hover:bg-blue-600 transition duration-300"
      >
        <nuxt-link v-if="!isLoggedIn" :to="{ name: 'login' }">login</nuxt-link
        ><nuxt-link v-else :to="{ name: 'surveys' }">home</nuxt-link>
      </div>
    </div>

    <div
      class="w-full flex flex-wrap-reverse md:flex-wrap front-page-spacing my-24"
    >
      <div class="front-page-text">
        <span class="front-page-header"
          >Welcome to <span class="text-blue-600">Saqsini</span>.</span
        >
        <span class="front-page-header"
          >Create surveys and analyse results in a flash!</span
        >
        <span class="front-page-subheader"
          >With Saqsini, you can create surveys with various question types,
          invite users, analyse their responses with automatically generated
          visuals, and export your data for further analysis.
        </span>
      </div>
      <div class="front-page-image">
        <img :src="image0" />
      </div>
    </div>

    <div class="front-page-spacing">
      <div class="front-page-element">
        <div class="front-page-image">
          <img :src="image1" class="h-48" />
        </div>
        <div class="front-page-text">
          <span class="front-page-header">Build Surveys</span>

          <span class="front-page-subheader">
            Saqsini allows you to build
            <span class="front-page-emphasis">unlimited surveys</span>, with
            <span class="front-page-emphasis">unlimited responses</span> for
            each survey.
          </span>
        </div>
      </div>
    </div>

    <div class="front-page-spacing">
      <div class="front-page-element">
        <div class="front-page-image">
          <img :src="image2" class="h-48" />
        </div>
        <div class="front-page-text">
          <span class="front-page-header">Mutliple Question Types</span>

          <span class="front-page-subheader">
            You can create
            <span class="front-page-emphasis">different type of questions</span>
            like multiple choice, likert, drop-down, radio grid, and others to
            get the best responses.
          </span>
        </div>
      </div>
    </div>

    <div class="front-page-spacing">
      <div class="front-page-element">
        <div class="front-page-image">
          <img :src="image3" class="h-48" />
        </div>
        <div class="front-page-text">
          <span class="front-page-header">Visualise Your Responses</span>

          <span class="front-page-subheader">
            Multiple <span class="front-page-emphasis">visualisations</span> for
            each question and every individual response.
          </span>
        </div>
      </div>
    </div>

    <div class="front-page-spacing">
      <div class="front-page-element">
        <div class="front-page-image">
          <img :src="image4" class="h-48" />
        </div>
        <div class="front-page-text">
          <span class="front-page-header">Contact List</span>

          <span class="front-page-subheader">
            You can also manage your own contact lists, so that you can
            re-invite your contacts or
            <span class="front-page-emphasis">intelligently invite</span>
            according to survey.
          </span>
        </div>
      </div>
    </div>

    <div
      class="w-full flex flex-wrap-reverse md:flex-wrap py-10 my-12 front-page-spacing"
    >
      <div
        class="w-full flex flex-wrap flex-col pr-20 font-normal space-y-4 items-center mb-4"
      >
        <span class="front-page-header">Trusted By</span>

        <span class="front-page-subheader"
          >Saqsini is trusted and used by these companies.
        </span>
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

    <div class="front-page-spacing mb-12">
      <div class="w-full flex flex-wrap py-8 shadow bg-gray-100 items-center">
        <div
          class="w-full flex flex-col justify-center items-center space-y-6 px-10"
        >
          <p class="front-page-header">Register Now!</p>
          <p class="text-gray-600">
            All you need to register is an email address, and you can start
            using our services immediately. Our survey builder comes at no cost,
            it is offered as a free service.
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
    </div>

    <div
      class="w-full flex flex-wrap bg-gradient-to-br from-gray-500 to-gray-700 p-5"
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
import image0 from '@/assets/images/front_page_first.svg'
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
      image0,
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

<style scoped>
.front-page-spacing {
  @apply px-4 md:px-48 py-4;
}

.front-page-text {
  @apply w-full md:w-8/12 flex flex-wrap flex-col pl-4 md:pl-0 md:pr-20  mb-4 md:mb-0 font-normal space-y-4;
}

.front-page-image {
  @apply w-full md:w-4/12 mb-5 md:mb-0 px-20 md:px-4 flex items-center justify-center;
}

.front-page-header {
  @apply text-2xl md:text-4xl leading-relaxed;
}

.front-page-subheader {
  @apply text-lg md:text-2xl text-gray-500 leading-relaxed;
}

.front-page-element {
  @apply w-full flex flex-wrap-reverse md:flex-wrap py-4 md:py-16 shadow bg-gray-100 items-center;
}

.front-page-emphasis {
  @apply text-blue-600 font-medium;
}
</style>
