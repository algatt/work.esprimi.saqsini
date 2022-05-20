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
            @valid="isValid = $event"
            @update="updatedItem = $event"
          ></component>
        </div>
      </ModalBody>
      <ModalFooter class="h-14">
        <div class="p-3 flex justify-between w-full">
          <l-button color="gray" @click="dismiss('dismissed')"
            >Cancel<template #rightIcon
              ><i class="fas fa-times fa-fw"></i></template
          ></l-button>
          <l-button
            :disabled="!isValid"
            :color="options.color ? options.color : 'blue'"
            @click="confirm(updatedItem)"
            >Save<template #rightIcon
              ><i class="fas fa-save fa-fw"></i></template
          ></l-button>
        </div>
      </ModalFooter>
    </div>
  </Modal>
</template>

<script>
import ModalHeader from '@/components/elements/Modal/ModalHeader'
import ModalFooter from '@/components/elements/Modal/ModalFooter'
import Modal from '@/components/elements/Modal/Modal'
import ModalBody from '@/components/elements/Modal/ModalBody'
import ModalMixin from '@/components/elements/Modal/ModalMixin'
import NewSurvey from '@/components/surveys/NewSurvey'
import LButton from '@/components/LButton'
import NewQuestion from '@/components/surveys/NewQuestion'
import NewContactList from '@/components/contacts/NewContactList'
import NewCompany from '@/components/contacts/NewCompany'
import NewDepartment from '@/components/contacts/NewDepartment'
import NewRole from '@/components/contacts/NewRole'
import NewContact from '@/components/contacts/NewContact'
import NewJob from '@/components/contacts/NewJob'
import NewQuestionTemplate from '@/components/surveys/NewQuestionTemplate'

export default {
  name: 'NewItemModal',
  components: {
    LButton,
    ModalFooter,
    ModalBody,
    ModalHeader,
    Modal,
    NewSurvey,
    NewQuestion,
    NewContactList,
    NewCompany,
    NewDepartment,
    NewRole,
    NewContact,
    NewJob,
    NewQuestionTemplate,
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
      isValid: false,
    }
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
