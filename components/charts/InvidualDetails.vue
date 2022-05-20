<template>
  <div class="mt-3">
    <div class="my-5 flex flex-col xl:flex-row">
      <div class="w-auto xl:mr-10">
        <l-select v-model="typeOfResponses">
          Type of Responses
          <template v-slot:options>
            <option value="all">All Types</option>
            <option value="kiosk">Kiosk</option>
            <option value="invites">Invites</option>
          </template>
        </l-select>
      </div>
      <div class="w-auto mt-2 xl:mt-0">
        <l-select v-model="isComplete">
          Status
          <template v-slot:options>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </template>
        </l-select>
      </div>
    </div>
    <data-table
      :table-data="invitations"
      :table-definition="invitationsTable"
      :enable-selection="false"
    >
      <template #type="slotProps">
        <span v-if="slotProps.item.flags.includes('KIOSK')"
          >Kiosk Response</span
        >
        <span v-else>{{ slotProps.item.email }}</span>
      </template>
      <template #status="slotProps">
        <div class="flex justify-start">
          <l-badge
            v-if="slotProps.item.flags.includes('SUBMITTED')"
            color="green"
            >submitted</l-badge
          >
          <l-badge
            v-else-if="slotProps.item.flags.includes('DISQUALIFIED')"
            color="red"
            >disqualified</l-badge
          >
        </div>
      </template>
      <template #lastAccessed="slotProps">
        {{ slotProps.item.lastAccessed.substring(0, 16) }}
      </template>
      <template #actions="slotProps">
        <div class="flex justify-end">
          <l-popup-menu>
            <template v-slot:menu>
              <button @click="viewResponses(slotProps.item)">
                <i class="far fa-comment-dots fa-fw"></i>View Responses
              </button>
              <button v-if="!slotProps.item.flags.includes('KIOSK')">
                <i class="fas fa-headset fa-fw"></i>
                <a
                  :href="`/survey?id=${surveyData.survey.publicIdentifier}&token=${slotProps.item.token}&edit=true`"
                  target="_blank"
                >
                  Edit Responses</a
                >
              </button>
              <button
                v-if="slotProps.item.email"
                @click="anonymiseByToken(slotProps.item.token)"
              >
                <i class="fas fa-user-secret fa-fw"></i>Anonymise
              </button>
              <button @click="deleteResponse(slotProps.item.token)">
                <i class="fas fa-trash-alt fa-fw"></i>Delete
              </button>
            </template>
          </l-popup-menu>
        </div>
      </template>
    </data-table>
  </div>
</template>

<script>
import LSelect from '@/components/LSelect'
import DataTable from '@/components/elements/DataTable/DataTable'
import LPopupMenu from '@/components/LPopupMenu'
import ModalService from '@/services/modal-services'
import PlainModal from '@/components/elements/PlainModal'
import ConfirmModal from '@/components/elements/ConfirmModal'

export default {
  name: 'InvidualDetailsVue',
  components: { LPopupMenu, DataTable, LSelect },

  data() {
    return {
      viewResponsesInvitee: {},
      typeOfResponses: 'all',
      isComplete: 'all',
      invitationsTable: [
        { title: 'Type', slot: 'type' },
        { title: 'Status', slot: 'status' },
        {
          title: 'Last Accessed',
          slot: 'lastAccessed',
          field: 'lastAccessed',
          sortable: true,
        },
        { title: '', slot: 'actions' },
      ],
    }
  },

  computed: {
    surveyData() {
      return this.$store.state.surveys.surveyData
    },
    invitations() {
      let temp = JSON.parse(JSON.stringify(this.surveyData.invitations))
      if (this.typeOfResponses === 'kiosk')
        temp = temp.filter((el) => {
          return el.flags.includes('KIOSK')
        })
      else if (this.typeOfResponses === 'invites')
        temp = temp.filter((el) => {
          return !el.flags.includes('KIOSK')
        })

      if (this.isComplete === 'completed')
        temp = temp.filter((el) => {
          return el.flags.includes('SUBMITTED')
        })
      else if (this.isComplete === 'incomplete')
        temp = temp.filter((el) => {
          return !el.flags.includes('SUBMITTED')
        })

      return temp.sort((a, b) => {
        return a.lastModified < b.lastModified ? 1 : -1
      })
    },
  },
  methods: {
    viewResponses(item) {
      ModalService.open(PlainModal, {
        whichComponent: 'ViewResponses',
        dataItem: item,
        options: {
          header: 'View Responses',
          close: true,
        },
      })
    },
    anonymiseByToken(token) {
      ModalService.open(ConfirmModal, {
        msg: 'This will remove all identifying details for this respondent.',
        deleteButton: 'Anonymise',
      })
        .then(() => {
          this.$store
            .dispatch('invitations/anonymiseResponsesByToken', token)
            .then(() => {
              this.$toasted.show('Response anonymisation in process')
            })
            .catch(() => {
              this.$toasted.error(
                'There was a problem anonymising the responses'
              )
            })
        })
        .catch(() => {})
    },
    deleteResponse(token) {
      ModalService.open(ConfirmModal, {
        msg: 'This will delete all the responses for this user.',
      })
        .then(() => {
          this.$store
            .dispatch('invitations/delete', token)
            .then(() => {
              this.$toasted.show(`Invite deleted`)
            })
            .catch(() => {
              this.$toasted.error('There was a problem deleting the invite')
            })
        })
        .catch(() => {})
    },
  },
}
</script>

<style scoped></style>
