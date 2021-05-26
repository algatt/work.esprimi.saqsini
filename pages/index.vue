<template>
  <div class="flex flex-col">
    <div class="w-full flex items-center justify-end px-10 py-5">
      <nuxt-link v-if="!isLoggedIn" :to="{ name: 'login' }"
        ><l-text-link class="text-lg">login</l-text-link></nuxt-link
      ><nuxt-link v-else :to="{ name: 'surveys' }"
        ><l-text-link class="text-lg">home</l-text-link></nuxt-link
      >
    </div>

    <div
      class="w-full flex flex-wrap bg-white md:pl-20 md:justify-start justify-center mt-5 mb-14"
    >
      <h1 class="text-primary">
        Saqsini <i class="far fa-comments fa-fw"></i>
      </h1>
    </div>

    <div class="w-full flex flex-wrap bg-gray-100">
      <div
        class="w-full flex flex-col md:w-6/12 py-5 md:pl-20 px-5 text-gray-600 justify-center"
      >
        <h2 class="tracking-wide mb-5">Build Surveys</h2>
        <p class="text-xl">
          Saqsini allows you to build unlimited surveys, with unlimited
          responses for each survey.
        </p>
      </div>
      <div class="w-full md:w-6/12 flex flex-col p-5">
        <img :src="image1" class="h-64 md:h-80" />
      </div>
    </div>

    <div class="w-full flex flex-wrap bg-white">
      <div class="w-full md:w-6/12 flex flex-col p-5">
        <img :src="image2" class="h-64 md:h-80" />
      </div>
      <div
        class="w-full flex flex-col md:w-6/12 py-5 md:pr-20 px-5 text-gray-600 justify-center"
      >
        <h2 class="tracking-wide mb-5">Question any way you like</h2>
        <p class="text-xl">
          You can create different type of questions like multiple choice,
          likert, drop-down, radio grid, and others to get the best responses.
        </p>
      </div>
    </div>

    <div class="w-full flex flex-wrap bg-gray-100">
      <div
        class="w-full flex flex-col md:w-6/12 py-5 md:pl-20 px-5 text-gray-600 justify-center"
      >
        <h2 class="tracking-wide mb-5">Visualise your responses</h2>
        <p class="text-xl">
          Multiple visualisations for each question and every individual
          response.
        </p>
      </div>
      <div class="w-full md:w-6/12 flex flex-col p-5">
        <img :src="image3" class="h-64 md:h-80" />
      </div>
    </div>

    <div class="w-full flex flex-wrap bg-white">
      <div class="w-full md:w-6/12 flex flex-col p-5">
        <img :src="image4" class="h-64 md:h-80" />
      </div>
      <div
        class="w-full flex flex-col md:w-6/12 py-5 md:pr-20 px-5 text-gray-600 justify-center"
      >
        <h2 class="tracking-wide mb-5">Contact List</h2>
        <p class="text-xl">
          You can also manage your own contact lists, so that you can re-invite
          your contacts or intelligently invite according to survey.
        </p>
      </div>
    </div>

    <div class="w-full flex flex-wrap bg-gray-600">
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
import LTextLink from '~/components/LTextLink'
export default {
  components: { LTextLink },
  layout: 'default',
  data() {
    return {
      image1,
      image2,
      image3,
      image4,
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.authUser
    },
  },
}
</script>
