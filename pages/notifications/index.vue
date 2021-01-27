<template>
  <div v-if="!loading">
    <top-header-bar which="notifications" class="w-full"
      ><template v-slot:title>Notifications</template>
      <template v-slot:button
        ><button class="btn btn-primary px-3" @click="selectAll">
          Select All
        </button>
        <button class="btn btn-primary px-3 ml-2" @click="markAllAsRead">
          Mark All As Read
        </button>
      </template></top-header-bar
    >

    <info-box
      v-if="notifications.length === 0"
      class="flex-grow mx-5 mt-2 md:mt-0"
    >
      <template v-slot:title>No notifications!</template>
      <template v-slot:content> You're all caught up... </template></info-box
    >

    <display-table-component
      v-else
      :items="notifications"
      @hovered="hovered = $event"
      @clicked="setCurrentItem($event)"
    >
      <template v-slot:title>Notifications</template>

      <template v-slot:titleContent>
        <p class="w-3/12">From</p>
        <p class="w-6/12">Subject</p>
        <p class="w-3/12">Date</p>
      </template>
      <template v-slot:titleContentSmall>Notifications</template>
      <template v-slot:content="slotProps">
        <p
          class="w-full xl:w-3/12 flex flex-row justify-between xl:flex-col"
          :class="
            slotProps.item.flags.includes('READ')
              ? 'text-gray-500'
              : 'text-gray-800'
          "
        >
          <span>{{ slotProps.item.author.displayName }}</span>
          <i> {{ slotProps.item.author.email }}</i>
        </p>
        <p
          class="w-full xl:w-6/12"
          :class="
            slotProps.item.flags.includes('READ')
              ? 'text-gray-500'
              : 'text-gray-800'
          "
        >
          <button class="btn-link" @click.stop="setCurrentItem(slotProps.item)">
            {{ slotProps.item.subject }}
          </button>
        </p>
        <p
          class="w-full xl:w-3/12"
          :class="
            slotProps.item.flags.includes('READ')
              ? 'text-gray-500'
              : 'text-gray-800'
          "
        >
          {{ formatDate(slotProps.item.createdTimestamp) }}
        </p>
      </template>
      <template v-slot:popup-menu="slotProps">
        <i
          v-if="slotProps.item.flags.includes('READ')"
          class="far fa-envelope-open fa-fw text-gray-400"
        ></i
        ><i v-else class="far fa-envelope fa-fw text-gray-600"></i>
      </template>
    </display-table-component>

    <transition name="fade">
      <edit-object-modal v-if="currentItemToBeEdited">
        <template v-slot:title>Notification</template>
        <template v-slot:content>
          <show-notifications></show-notifications>
        </template>
      </edit-object-modal>
    </transition>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import moment from 'moment'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import Spinner from '~/components/layouts/Spinner'
import ShowNotifications from '~/components/layouts/ShowNotifications'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import InfoBox from '~/components/layouts/InfoBox'

export default {
  name: 'IndexVue',
  components: {
    ShowNotifications,
    Spinner,
    DisplayTableComponent,
    TopHeaderBar,
    InfoBox,
  },
  data() {
    return {
      hovered: null,
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    currentItemToBeEdited() {
      return this.$store.state.currentItemToBeEdited
    },
    notifications() {
      const tempNotifications = JSON.parse(
        JSON.stringify(this.$store.getters.getItems('notifications'))
      )

      tempNotifications.sort((a, b) => {
        return moment(a.createdTimestamp.replace(' +', '+')).valueOf() <
          moment(b.createdTimestamp.replace(' +', '+')).valueOf()
          ? 1
          : -1
      })

      return tempNotifications
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    this.$store
      .dispatch('notifications/getNotifications', {
        limit: 100,
        offset: 0,
      })
      .finally(() => {
        this.$store.dispatch('setLoading', false)
      })
  },
  methods: {
    setCurrentItem(item) {
      console.log(item)
      if (!item.flags.includes('READ'))
        this.$store.dispatch('updateItem', { which: 'notifications', item })
      this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
    formatDate(date) {
      date = date.replace(' +', '+')
      return moment(date).format('Do MMM YYYY LT')
    },
    selectAll() {
      this.notifications.forEach((el) => {
        this.$store.dispatch('selectedItemsManage', el)
      })
    },
    markAllAsRead() {
      this.$store.dispatch('notifications/markAllAsRead').then(() => {
        this.$store.dispatch('setLoading', true)
        this.$store
          .dispatch('notifications/getNotifications', {
            limit: 100,
            offset: 0,
          })
          .finally(() => {
            this.$store.dispatch('setLoading', false)
          })
      })
    },
  },
}
</script>

<style scoped></style>
