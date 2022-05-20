<template>
  <Modal>
    <div
      class="bg-white p-5 rounded border border-gray-300 rounded shadow-md"
      style="min-width: 300px"
    >
      <ModalHeader> Are you sure? </ModalHeader>
      <ModalBody>
        <p>{{ msg }}</p>
      </ModalBody>
      <ModalFooter>
        <l-button color="gray" @click="dismiss('dismissed')">{{
          cancelButton
        }}</l-button>
        <l-button color="red" @click="confirm('confirm')">{{
          deleteButton
        }}</l-button>
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

export default {
  components: { ModalFooter, ModalBody, ModalHeader, Modal },
  mixins: [ModalMixin],
  props: {
    msg: {
      type: String,
      default: '',
    },
    cancelButton: {
      type: String,
      default: 'Cancel',
    },
    deleteButton: {
      type: String,
      default: 'Delete',
    },
  },
}
</script>
