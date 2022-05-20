<template>
  <div v-if="!loading">
    <data-table
      :table-data="invites"
      :table-definition="tableInvites"
      @selectItems="selectedItems = $event"
      @deleteAll="deleteAll"
    >
      <template #email="slotProps">
        <span v-if="slotProps.item.email">{{ slotProps.item.email }}</span>
        <span v-else>anonymous</span>
      </template>
      <template #flags="slotProps">
        <div class="flex items-center space-x-2">
          <l-badge
            v-for="(flag, index) in processFlags(slotProps.item.flags)"
            :key="index"
            >{{ flag }}</l-badge
          >
        </div>
      </template>
      <template #actions="slotProps">
        <div class="flex justify-center">
          <l-popup-menu>
            <template v-slot:menu>
              <button
                v-if="slotProps.item.email"
                @click="anonymiseByToken(slotProps.item.token)"
              >
                <i class="fas fa-user-secret fa-fw"></i>Anonymise
              </button>
              <button @click="deleteAll([slotProps.item])">
                <i class="fas fa-trash-alt fa-fw"></i>Delete
              </button></template
            >
          </l-popup-menu>
        </div>
      </template>
    </data-table>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import DataTable from '@/components/elements/DataTable/DataTable'
import LPopupMenu from '@/components/LPopupMenu'
import Spinner from '@/components/elements/Spinner'
export default {
  name: 'InvitesList',
  components: { Spinner, LPopupMenu, DataTable },
  props: {
    survey: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      selectedItems: [],
      tableInvites: [
        {
          title: 'Email',
          slot: 'email',
          sortable: true,
        },
        { title: 'Flags', slot: 'flags' },
        { title: 'Actions', slot: 'actions', align: 'center' },
      ],
    }
  },
  computed: {
    invites() {
      const x = this.$store.state.invitations.items
      x.forEach((el) => {
        el.code = el.token
      })
      return x
    },
  },
  mounted() {
    this.$store
      .dispatch('invitations/getAll', {
        code: this.survey.code,
      })
      .then(() => {
        this.loading = false
      })
  },
  methods: {
    processFlags(flags) {
      const result = []
      flags.forEach((el) => {
        result.push(
          el.substring(0, 1).toUpperCase() +
            el.substring(1, el.length).toLowerCase()
        )
      })
      return result
    },
    deleteAll(selectedItems) {
      const calls = []
      for (const item in selectedItems) {
        calls.push(
          this.$store.dispatch('invitations/delete', selectedItems[item].token)
        )
      }
      Promise.all(calls)
        .then(() => {
          this.$toasted.show(`${selectedItems.length} invites deleted`)
        })
        .catch(() => {
          this.$toasted.error('There was a problem deleting the invites')
        })
    },
    anonymiseByToken(token) {
      this.$store
        .dispatch('invitations/anonymiseResponsesByToken', token)
        .then(() => {
          this.$toasted.show('Response anonymisation in process')
        })
        .catch(() => {
          this.$toasted.error('There was a problem anonymising the responses')
        })
    },
  },
}
</script>

<style scoped></style>
