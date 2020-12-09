<template>
  <div
    class="fixed top-0 left-0 bg-gray-200 bg-opacity-75 w-full h-full z-20 flex py-10 px-32"
    @click="$emit('modalClosed')"
  >
    <div class="w-full flex flex-col bg-white relative" @click.stop>
      <div class="absolute top-0 left-0 w-full h-full overflow-auto">
        <preview-survey
          :survey="survey"
          :questions="questions"
          @finishSurvey="$emit('modalClosed')"
        ></preview-survey>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewSurvey from '~/components/surveys/PreviewSurvey'
export default {
  name: 'PreviewSurveyModal',
  components: { PreviewSurvey },
  props: {
    survey: {
      type: Object,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    document.documentElement.style.overflow = 'hidden'
    document.body.scroll = 'no'
  },
  destroyed() {
    document.documentElement.style.overflow = 'visible'
    document.body.scroll = 'yes'
    this.$emit('modalClosed')
  },
}
</script>

<style scoped></style>
