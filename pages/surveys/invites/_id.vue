<template>
  <list-layout v-if="!loading">
    <div class="w-full mt-3 mb-6 flex justify-between flex-wrap">
      <div class="w-full md:w-6/12 flex justify-start items-center px-4">
        <h4 class="mt-2 mr-5">{{ survey.name }}</h4>
        <l-select
          v-if="canUseContactBook"
          :value="selectedContactList.code"
          :disabled="
            getBranchingContactBook().includes(selectedContactList.code)
          "
          @input="changeContactBook"
          ><template v-slot:options
            ><option v-for="cl in contactLists" :key="cl.code" :value="cl.code">
              {{ cl.name }}
            </option></template
          ></l-select
        >
      </div>
      <div class="w-full md:w-6/12 flex justify-start md:justify-end px-4">
        <LPopupMenu>
          <template #icon>
            <l-button
              >Settings<template v-slot:rightIcon
                ><i class="fas fa-caret-down fa-fw"></i></template
            ></l-button>
          </template>
          <template v-slot:menu>
            <button @click="manageSurvey">
              <i class="fas fa-clipboard-list fa-fw"></i>Manage Survey
            </button>
            <button @click="viewResponses">
              <i class="fas fa-chart-bar fa-fw"></i>View Responses
            </button>
          </template>
        </LPopupMenu>
      </div>
    </div>

    <div class="w-full flex flex-col mx-auto px-4">
      <div class="flex items-center">
        <menu-icon-button
          :active="selectedMenu === 'list'"
          @click="selectedMenu = 'list'"
          ><template v-slot:icon><i class="fas fa-th-list fa-fw"></i></template
          >Invites</menu-icon-button
        >
        <menu-icon-button
          :active="selectedMenu === 'email'"
          @click="selectedMenu = 'email'"
          ><template v-slot:icon><i class="fas fa-envelope fa-fw"></i></template
          >Email</menu-icon-button
        >
        <menu-icon-button
          :active="selectedMenu === 'contacts'"
          @click="selectedMenu = 'contacts'"
          ><template v-slot:icon><i class="fas fa-users fa-fw"></i></template
          >Contacts</menu-icon-button
        >
        <menu-icon-button
          :active="selectedMenu === 'contactlist'"
          @click="selectedMenu = 'contactlist'"
          ><template v-slot:icon
            ><i class="fas fa-address-book fa-fw"></i></template
          >Contact List</menu-icon-button
        >
      </div>
      <div class="">
        <invites-list
          v-if="selectedMenu === 'list'"
          :survey="survey"
        ></invites-list>
        <invite-by-email
          v-if="selectedMenu === 'email'"
          :survey="survey"
        ></invite-by-email>
        <invite-by-contacts
          v-if="selectedMenu === 'contacts'"
          :survey="survey"
        ></invite-by-contacts>
        <invite-by-contact-list
          v-if="selectedMenu === 'contactlist'"
          :survey="survey"
        ></invite-by-contact-list>
      </div>
    </div>
  </list-layout>
</template>

<script>
import ListLayout from '~/components/layouts/ListLayout'
import MenuIconButton from '~/components/layouts/MenuIconButton'
import InviteByEmail from '~/components/surveys/InviteByEmail'
import InvitesList from '~/components/surveys/InvitesList'
import InviteByContacts from '~/components/surveys/InviteByContacts'
import InviteByContactList from '~/components/surveys/InviteByContactList'
export default {
  name: 'InvitesView',
  components: {
    InviteByContacts,
    InviteByEmail,
    MenuIconButton,
    ListLayout,
    InvitesList,
    InviteByContactList,
  },
  middleware: ['surveyBuilder'],
  layout: 'authlayout',
  data() {
    return {
      loading: true,
      selectedMenu: 'list',
    }
  },
  computed: {
    canUseContactBook() {
      return this.$store.getters['auth/getPermissions'].includes('CONTACTBOOK')
    },
    survey() {
      return this.$store.state.surveys.items[0]
    },
    contactLists() {
      return this.$store.state.contactlist.items
    },
    selectedContactList() {
      return this.$store.state.selectedContactList
    },
    sortedQuestions() {
      const x = JSON.parse(JSON.stringify(this.$store.state.questions.items))
      return x.sort((a, b) => {
        return a.ordinalPosition > b.ordinalPosition ? 1 : -1
      })
    },
  },
  mounted() {
    this.loading = true
    this.loadData().then(() => {
      this.loading = false
    })
  },
  methods: {
    loadData() {
      return new Promise((resolve, reject) => {
        const promises = [
          this.$store.dispatch('contactlist/getContactLists', {}),
          this.$store.dispatch(
            'surveys/getSurveyByCode',
            this.$route.params.id
          ),
          this.$store.dispatch('questions/getQuestionsBySurvey', {
            code: this.$route.params.id,
          }),
        ]
        if (this.canUseContactBook)
          promises.push(this.$store.dispatch('contactlist/getContactLists', {}))
        if (
          this.canUseContactBook &&
          this.getBranchingContactBook().length > 0
        ) {
          let tempLists = this.$store.state.contactlist.items
          tempLists = tempLists.find((el) => {
            return el.code === this.getBranchingContactBook()[0]
          })
          promises.push(this.$store.dispatch('setContactList', tempLists))
        }
        Promise.all(promises).then(() => {
          this.loading = false
          resolve()
        })
      })
    },
    getBranchingContactBook() {
      const code = []
      for (const i in this.sortedQuestions) {
        const tempQuestion = JSON.parse(this.sortedQuestions[i].surveyOptions)
        if (tempQuestion.branching.rules.length > 0) {
          tempQuestion.branching.rules.forEach((rule) => {
            rule.ruleList.forEach((ruleList) => {
              if (ruleList.contactListCode) {
                code.push(ruleList.contactListCode)
              }
            })
          })
        }
      }
      return code
    },
    changeContactBook(code) {
      const contactList = this.contactLists.find((el) => {
        return el.code === code
      })
      this.$store.dispatch('setContactList', contactList)
    },
    manageSurvey() {
      this.$router.push({
        name: 'questions-id',
        params: { id: this.$route.params.id },
      })
    },
    viewResponses() {
      this.$router.push({
        name: 'surveys-responses-id',
        params: { id: this.$route.params.id },
      })
    },
  },
}
</script>

<style scoped></style>
