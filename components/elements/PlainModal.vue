<template>
  <Modal>
    <div
      class="bg-white w-full md:w-8/12 border border-gray-100 shadow-lg md:rounded modalHeight flex flex-col justify-between"
    >
      <ModalHeader class="h-14">
        <div
          class="text-white p-3 md:rounded-t"
          :class="`bg-${options.color ? options.color : 'blue'}-600`"
        >
          {{ options.header ? options.header : 'New' }}
        </div></ModalHeader
      >
      <ModalBody class="overflow-y-auto bodyHeight">
        <div class="p-3">
          <component
            :is="whichComponent"
            :data-item="dataItem"
            @isValid="isValid = $event"
            @update="updatedItem = $event"
          ></component>
        </div>
      </ModalBody>
      <ModalFooter class="h-14">
        <div class="p-3 flex justify-between w-full">
          <template v-if="!options.close">
            <l-button color="gray" @click="dismiss('dismissed')"
              >Cancel<template #rightIcon
                ><i class="fas fa-times fa-fw"></i></template
            ></l-button>

            <l-button
              :color="options.color ? options.color : 'blue'"
              :disabled="!isValid"
              @click="confirm(updatedItem)"
              ><span v-if="options && options.saveName">{{
                options.saveName
              }}</span
              ><span v-else>Save</span
              ><template #rightIcon
                ><i
                  :class="
                    options.saveIcon ? options.saveIcon : `fas fa-save fa-fw`
                  "
                ></i></template
            ></l-button>
          </template>
          <template v-else-if="options.close">
            <l-button color="gray" @click="confirm('')"
              >Close<template #rightIcon
                ><i class="fas fa-times fa-fw"></i></template
            ></l-button>
          </template>
        </div>
      </ModalFooter>
    </div>
  </Modal>
</template>

<script>
import ModalHeader from '@/components/elements/Modal/ModalHeader'
import ModalFooter from '@/components/elements/Modal/ModalFooter'
import ModalMixin from '~/components/elements/Modal/ModalMixin'
import Modal from '~/components/elements/Modal/Modal'
import ModalBody from '~/components/elements/Modal/ModalBody'
import LButton from '~/components/LButton'

import QuestionMoveMenu from '~/components/surveys/QuestionMoveMenu'
import SurveyLanguageSettings from '~/components/surveys/SurveyLanguageSettings'
import SurveyCollaborators from '~/components/surveys/SurveyCollaborators'
import SurveyInvitesSettings from '~/components/surveys/SurveyInvitesSettings'
import ContactListCollaborators from '~/components/contacts/ContactListCollaborators'
import ShowNotifications from '~/components/elements/ShowNotifications'
import ViewResponses from '~/components/charts/ViewResponses'
import SelectQuestionTemplate from '~/components/surveys/SelectQuestionTemplate'

export default {
  name: 'PlainModal',
  components: {
    LButton,
    ModalFooter,
    ModalBody,
    ModalHeader,
    Modal,
    QuestionMoveMenu,
    SurveyLanguageSettings,
    SurveyCollaborators,
    SurveyInvitesSettings,
    ContactListCollaborators,
    ShowNotifications,
    ViewResponses,
    SelectQuestionTemplate,
  },
  mixins: [ModalMixin],
  props: {
    whichComponent: {
      type: String,
      required: true,
    },
    dataItem: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
    options: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      updatedItem: {},
      isValid: true,
    }
  },
  watch: {
    isValid(ev) {
      console.log(ev)
    },
  },
}
</script>

<style>
@media only screen and (max-width: 767px) {
  .modalHeight {
    height: 100vh;
  }
}

@media only screen and (min-width: 768px) {
  .modalHeight {
    height: 95vh;
    max-height: 95vh;
  }
}

.bodyHeight {
  min-height: calc(100% - 7rem - 5vh);
  max-height: calc(100% - 7rem - 5vh);
}
</style>
