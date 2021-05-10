import { QUESTION_TYPES } from '~/assets/settings/survey-settings'
import { PREFERRED_LANGUAGE } from '~/helpers/constants'

export function getQuestionTypeText(flags) {
  for (const i in flags) {
    Object.keys(QUESTION_TYPES).includes(flags[i])
    if (Object.keys(QUESTION_TYPES).includes(flags[i]))
      return QUESTION_TYPES[flags[i]].text
  }
}

export function getQuestionType(item) {
  const questionTypes = Object.keys(QUESTION_TYPES)
  let whichQuestion = ''
  questionTypes.forEach((type) => {
    if (item.flags.includes(type)) whichQuestion = type
  })
  return whichQuestion
}

export function convertQuestionFromApiToForm(
  question,
  language = PREFERRED_LANGUAGE
) {
  const temp = JSON.parse(JSON.stringify(question))
  const whichQuestion = getQuestionType(temp)

  if (!temp.defaultLanguage) temp.defaultLanguage = language

  if (temp.text) {
    const text = temp.text.find((el) => {
      return el.language === language
    })
    temp.text = text.text
  }

  if (temp.options) {
    const options = temp.options
    temp.options = []
    options.forEach((el) => {
      const text = el.text.find((el2) => {
        return el2.language === language
      }).text
      const obj = {
        ordinalPosition: el.ordinalPosition,
        text,
        value: el.value,
      }
      if (el.flags) obj.flags = el.flags

      temp.options.push(obj)
    })
  }

  if (temp.surveyOptions) {
    const surveyOptions = JSON.parse(temp.surveyOptions)

    QUESTION_TYPES[whichQuestion].options.forEach((item) => {
      temp[item] = surveyOptions[item]
    })

    if (surveyOptions.branching) {
      temp.branching = surveyOptions.branching
    } else {
      temp.branching = {
        rules: [],
      }
    }

    if (surveyOptions.disqualify) {
      temp.disqualify = surveyOptions.disqualify
    } else {
      temp.disqualify = { rules: [] }
    }

    delete temp.surveyOptions
  }

  temp.isMandatory = temp.flags.includes('IS_MANDATORY')

  return temp
}

export function convertQuestionFromFormToApi(question) {
  const temp = JSON.parse(JSON.stringify(question))

  const whichQuestion = getQuestionType(temp)

  temp.text = [{ language: PREFERRED_LANGUAGE, text: temp.text }]

  if (temp.options) {
    const formOptions = temp.options
    temp.options = []
    formOptions.forEach((el) => {
      const obj = {
        ordinalPosition: el.ordinalPosition,
        text: [{ language: PREFERRED_LANGUAGE, text: el.text }],
        value: el.value,
        surveyOptions: null,
      }
      if (el.mask) obj.mask = el.mask
      if (el.flags) obj.flags = el.flags
      temp.options.push(obj)
    })
  }

  temp.surveyOptions = {}

  QUESTION_TYPES[whichQuestion].options.forEach((item) => {
    temp.surveyOptions[item] = temp[item]
  })

  temp.surveyOptions.branching = question.branching
  temp.surveyOptions.disqualify = question.disqualify
  temp.surveyOptions = JSON.stringify(temp.surveyOptions)

  temp.flags = temp.flags.filter((el) => {
    return el !== 'IS_MANDATORY'
  })

  if (temp.isMandatory) temp.flags.push('IS_MANDATORY')

  delete temp.translatedText

  return temp
}
