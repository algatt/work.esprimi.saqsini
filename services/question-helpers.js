import { QUESTION_TYPES } from '~/assets/settings/survey-settings'

export function getQuestionTypeText(flags) {
  for (const i in flags) {
    Object.keys(QUESTION_TYPES).includes(flags[i])
    if (Object.keys(QUESTION_TYPES).includes(flags[i]))
      return QUESTION_TYPES[flags[i]].text
  }
}
