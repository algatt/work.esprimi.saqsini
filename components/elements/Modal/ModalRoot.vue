<template>
  <section>
    <transition name="modal">
      <component
        :is="modal.component"
        v-if="modal"
        :dismiss="modal.dismiss"
        :confirm="modal.confirm"
        v-bind="modal.props"
      ></component>
    </transition>
  </section>
</template>

<script>
import ModalService from '@/services/modal-services'
import Modal from '@/components/elements/Modal/Modal'

export default {
  name: 'ModalRoot',
  components: { Modal },
  data() {
    return {
      modal: {},
    }
  },
  created() {
    ModalService.$on('open', ({ component, props, resolve, reject }) => {
      this.modal = {
        component,
        props,
        confirm: (value) => {
          this.modal = {}
          resolve(value)
        },
        dismiss: (reason) => {
          this.modal = {}
          reject(reason)
        },
      }
    })
  },
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease-out;
}
.modal-enter,
.modal-leave-to {
  transform: translateY(25px);
  opacity: 0;
}
</style>
