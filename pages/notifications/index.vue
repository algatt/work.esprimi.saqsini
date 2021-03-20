<template>
  <div v-if="!loading">
    <top-header-bar
      which="notifications"
      :items="notifications"
      class="w-full"
      :hide-menu="notifications.length === 0"
      ><template v-slot:title>Notifications</template>
      <template v-slot:menuButtonIfSelected>
        <button class="w-full" @click="markAllAsRead">
          <span class="popup-menu-button">
            <i class="far fa-envelope-open fa-fw mr-1"></i>Mark All As
            Read</span
          >
        </button>
      </template></top-header-bar
    >

    <info-box v-if="notifications.length === 0" class="flex-grow mt-2 md:mt-0">
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
        <p class="w-3/12 text-right">Date</p>
      </template>
      <template v-slot:titleContentSmall>Notifications</template>
      <template v-slot:content="slotProps">
        <p
          class="w-full xl:w-3/12 flex flex-row justify-between xl:flex-col mb-2 lg:mb-0"
          :class="
            slotProps.item.flags.includes('READ')
              ? 'text-gray-400'
              : 'text-gray-600'
          "
        >
          <span>{{ slotProps.item.author.displayName }}</span>
          <i class="hidden xl:flex"> {{ slotProps.item.author.email }}</i>
        </p>
        <p
          class="w-full xl:w-6/12 flex items-center mb-2 lg:mb-0"
          :class="
            slotProps.item.flags.includes('READ')
              ? 'text-gray-400'
              : 'text-gray-600'
          "
        >
          <i
            v-if="slotProps.item.flags.includes('READ')"
            class="hidden xl:flex far fa-envelope-open fa-fw text-gray-400 mr-2"
          ></i
          ><i
            v-else
            class="hidden xl:flex far fa-envelope fa-fw text-gray-700 mr-2"
          ></i>
          <button
            class="subject-link flex items-center"
            :class="
              slotProps.item.flags.includes('READ')
                ? 'text-gray-400'
                : 'text-gray-600'
            "
            @click.stop="setCurrentItem(slotProps.item)"
          >
            {{ slotProps.item.subject }}
          </button>
        </p>
        <p
          class="w-full xl:w-3/12 text-left xl:text-right"
          :class="
            slotProps.item.flags.includes('READ')
              ? 'text-gray-400'
              : 'text-gray-600'
          "
        >
          {{ formatDate(slotProps.item.createdTimestamp) }}
        </p>
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
import viewMixin from '~/helpers/viewMixin'
import EditObjectModal from '~/components/layouts/EditObjectModal'

export default {
  name: 'IndexVue',
  components: {
    ShowNotifications,
    Spinner,
    DisplayTableComponent,
    TopHeaderBar,
    InfoBox,
    EditObjectModal,
  },
  mixins: [viewMixin],

  computed: {
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
      if (!item.flags.includes('READ'))
        this.$store.dispatch('updateItem', { which: 'notifications', item })
      this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
    formatDate(date) {
      date = date.replace(' +', '+')
      // return moment(date).format('Do MMM YYYY LT')
      return moment(date).fromNow()
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

<style scoped>
.subject-link {
  @apply hover:underline hover:text-gray-800 transition duration-300 focus:outline-none font-medium;
}
</style>
