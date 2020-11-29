<template>
  <jobs-list :contacts="contacts"></jobs-list>
</template>

<script>
import JobsList from '~/components/contacts/JobsList'
export default {
  name: 'JobsContactsPage',
  components: { JobsList },

  computed: {
    contacts() {
      return this.$store.getters.getItems('contacts')
    },
  },
  created() {
    this.$store.dispatch('jobs/getJobsByContact', this.$route.params.id)
  },
}
</script>
