<template>
  <list-layout v-if="!loading && !error">
    <data-table
      :table-data="notifications"
      :table-definition="tableNotifications"
      @deleteAll="deleteNotifications"
    >
      <template v-slot:headerLeft><h5>Notifications</h5></template>
      <template v-slot:headerRight
        ><l-button
          class="ml-2"
          :disabled="notifications.length === 0"
          @click="markAllAsRead"
          >Mark all as Read</l-button
        ></template
      >
      <template v-slot:from="slotProps">
        <div class="flex flex-col">
          <span> {{ slotProps.item.author.displayName }}</span>
          <span> {{ slotProps.item.author.email }}</span>
        </div>
      </template>
      <template v-slot:subject="slotProps">
        <div
          class="flex items-center"
          @click.stop="showContent(slotProps.item)"
        >
          <div class="flex items-center">
            <i
              v-if="slotProps.item.flags.includes('READ')"
              class="far fa-envelope-open fa-fw text-gray-400 mr-2"
            ></i
            ><i v-else class="far fa-envelope fa-fw text-gray-700 mr-2"></i>
            <div class="subject-link">
              {{ slotProps.item.subject }}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:date="slotProps">
        {{ showAsDate(slotProps.item.createdTimestamp) }}</template
      >
    </data-table>
  </list-layout>
  <page-load-error v-else-if="!loading && error"></page-load-error>
  <spinner v-else-if="loading"></spinner>
</template>

<script>
import { DateTime } from 'luxon'
import ListLayout from '~/components/layouts/ListLayout'
import DataTable from '~/components/elements/DataTable/DataTable'
import ModalService from '~/services/modal-services'
import PlainModal from '~/components/layouts/PlainModal'
import PageLoadError from '~/components/layouts/PageLoadError'
import Spinner from '~/components/layouts/Spinner'
export default {
  name: 'Notifications',
  components: { Spinner, PageLoadError, DataTable, ListLayout },
  layout: 'authlayout',
  middleware: 'auth',
  data() {
    return {
      loading: true,
      error: false,
      tableNotifications: [
        { title: 'From', slot: 'from', field: 'author.email', sortable: true },
        { title: 'Subject', slot: 'subject', field: 'subject' },
        {
          title: 'Date',
          slot: 'date',
          field: 'createdTimestamp',
          sortable: true,
        },
      ],
    }
  },
  computed: {
    notifications() {
      return this.$store.getters['notifications/sortedNotifications']
    },
  },
  created() {
    this.loading = true
    this.$store
      .dispatch('notifications/getNotifications', {})
      .catch(() => {
        this.error = true
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    showContent(item) {
      if (!item.flags.includes('READ'))
        this.$store.dispatch('notifications/readNotification', item)
      ModalService.open(PlainModal, {
        whichComponent: 'ShowNotifications',
        dataItem: item,
        options: {
          close: true,
        },
      })
    },
    showAsDate(date) {
      return DateTime.fromFormat(date, 'yyyy-MM-dd hh:mm:ss ZZZ').toFormat(
        'dd-MMM-yy'
      )
    },

    markAllAsRead() {
      this.$store.dispatch('notifications/markAllAsRead').then(() => {
        this.$store.dispatch('notifications/getNotifications', {})
      })
    },
    deleteNotifications(notifications) {
      const calls = []
      for (const notification in notifications) {
        calls.push(
          this.$store.dispatch(
            'notifications/deleteNotification',
            notifications[notification].code
          )
        )
      }
      Promise.all(calls)
        .then(() => {
          this.$toasted.show(`${notifications.length} notifications deleted`)
        })
        .catch(() => {
          this.$toasted.error('There was a problem deleting the notifications')
        })
    },
  },
}
</script>

<style scoped>
.subject-link {
  @apply hover:underline hover:text-gray-800 transition duration-300 focus:outline-none font-medium;
}
</style>
