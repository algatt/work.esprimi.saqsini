import { QUESTION_HELP } from '~/helpers/constants'

export default {
  data() {
    return {
      infoNumber: QUESTION_HELP.NUMBER,
      infoName: QUESTION_HELP.NAME,
      infoText: QUESTION_HELP.TEXT,
      infoRequired: QUESTION_HELP.REQUIRED,
      selectedSection: 'details',
    }
  },
}
