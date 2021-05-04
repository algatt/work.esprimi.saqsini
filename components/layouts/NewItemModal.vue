<template>
  <Modal>
    <div
      class="bg-white w-full md:w-8/12 border border-gray-100 shadow-lg md:rounded modalHeight"
    >
      <ModalHeader class="h-14">
        <div class="bg-blue-600 text-white p-3 md:rounded-t">
          New Survey
        </div></ModalHeader
      >
      <ModalBody class="overflow-y-auto bodyHeight">
        <div class="p-3">
          <component :is="whichComponent" :data-item="dataItem"></component>
        </div>
      </ModalBody>
      <ModalFooter class="h-14">
        <div class="p-3 flex justify-between w-full">
          <button-base color="gray" @click="dismiss('dismissed')"
            >Cancel<template #rightIcon
              ><i class="fas fa-times fa-fw"></i></template
          ></button-base>
          <button-base color="blue" @click="confirm('confirm')"
            >Save<template #rightIcon
              ><i class="fas fa-save fa-fw"></i></template
          ></button-base>
        </div>
      </ModalFooter>
    </div>
  </Modal>
</template>

<script>
import ModalHeader from '@/components/elements/Modal/ModalHeader'
import ModalFooter from '@/components/elements/Modal/ModalFooter'
import Modal from '~/components/elements/Modal/Modal'
import ModalBody from '~/components/elements/Modal/ModalBody'
import ModalMixin from '~/components/elements/Modal/ModalMixin'
import ButtonBase from '~/components/elements/ButtonBasic'
import NewSurvey from '~/components/layouts/Surveys/NewSurvey'

export default {
  components: {
    ButtonBase,
    ModalFooter,
    ModalBody,
    ModalHeader,
    Modal,
    NewSurvey,
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
