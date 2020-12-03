<template>
  <div v-if="!loading" class="flex flex-wrap">{{ questions }}</div>
  <spinner v-else></spinner>
</template>

<script>
import Spinner from '~/components/layouts/Spinner'
export default {
  name: 'QuestionList',
  components: { Spinner },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    questions() {
      return this.$store.getters.getItems('questions')
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    Promise.all([
      this.$store.dispatch('questions/getQuestionsBySurvey', {
        limit: 1000,
        offset: 0,
        code: this.$route.params.id,
      }),
    ]).then(() => {
      this.$store.dispatch('setLoading', false)
    })
  },
}
</script>

<style scoped></style>
