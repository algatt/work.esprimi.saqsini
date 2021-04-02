import moment from 'moment'
import {
  PREFERRED_LANGUAGE,
  QUESTION_TYPES,
  SURVEY_OPTIONS,
} from '~/helpers/constants'

export function parseSurveyToForm(survey, language = PREFERRED_LANGUAGE) {
  const temp = JSON.parse(JSON.stringify(survey))

  if (!temp.defaultLanguage) temp.defaultLanguage = language
  if (!temp.referenceDate) temp.referenceDate = moment().format('YYYY-MM-DD')
  if (!temp.validFromTimestamp) {
    temp.validFromDate = moment().format('YYYY-MM-DD')
    temp.validFromTime = '08:00'
  } else {
    temp.validFromDate = moment(
      temp.validFromTimestamp.replace(' +', '+')
    ).format('YYYY-MM-DD')
    temp.validFromTime = moment(
      temp.validFromTimestamp.replace(' +', '+')
    ).format('HH:mm')
  }
  if (temp.validToTimestamp) {
    temp.validToDate = moment(temp.validToTimestamp.replace(' +', '+')).format(
      'YYYY-MM-DD'
    )
    temp.validToTime = moment(temp.validToTimestamp.replace(' +', '+')).format(
      'HH:mm'
    )
  }

  if (temp.notificationTimestamp) {
    temp.notificationDate = moment(
      temp.notificationTimestamp.replace(' +', '+')
    ).format('YYYY-MM-DD')
    temp.notificationTime = moment(
      temp.notificationTimestamp.replace(' +', '+')
    ).format('HH:mm')
  }

  if (temp.reminderTimestamp) {
    temp.reminderDate = moment(
      temp.reminderTimestamp.replace(' +', '+')
    ).format('YYYY-MM-DD')
    temp.reminderTime = moment(
      temp.reminderTimestamp.replace(' +', '+')
    ).format('HH:mm')
  }

  if (temp.text) {
    const text = temp.text.find((el) => {
      return el.language === language
    })
    temp.text = text.text
  }

  if (temp.options) {
    temp.options = JSON.parse(temp.options)
  } else {
    temp.options = SURVEY_OPTIONS
  }

  temp.translatedText = {}

  if (temp.standardText) {
    temp.standardText.forEach((el) => {
      const value = el.languages.find((langs) => {
        return langs.language === language
      })
      temp.translatedText[el.code] = value
    })
  }

  return temp
}

export function parseSurveyToAPI(survey) {
  const temp = JSON.parse(JSON.stringify(survey))

  const dateStringFrom = temp.validFromDate + ' ' + temp.validFromTime
  temp.validFromTimestamp = moment(dateStringFrom).format(
    'YYYY-MM-DD HH:MM:SSZZ'
  )
  delete temp.validFromDate
  delete temp.validFromTime

  if (temp.validToDate) {
    const dateStringTo = temp.validToDate + ' ' + temp.validToTime
    temp.validToTimestamp = moment(dateStringTo).format('YYYY-MM-DD HH:MM:SSZZ')
    delete temp.validToDate
    delete temp.validToTime
  }

  if (temp.notificationDate) {
    const dateStringTo = temp.notificationDate + ' ' + temp.notificationTime
    temp.notificationTimestamp = moment(dateStringTo).format(
      'YYYY-MM-DD HH:MM:SSZZ'
    )
    delete temp.notificationDate
    delete temp.notificationTime
  }

  if (temp.reminderDate) {
    const dateStringTo = temp.reminderDate + ' ' + temp.reminderTime
    temp.reminderTimestamp = moment(dateStringTo).format(
      'YYYY-MM-DD HH:MM:SSZZ'
    )
    delete temp.reminderDate
    delete temp.reminderTime
  }

  temp.text = [{ language: PREFERRED_LANGUAGE, text: temp.text }]

  if (!temp.options) {
    temp.options = JSON.stringify(SURVEY_OPTIONS)
  } else {
    temp.options = JSON.stringify(temp.options)
  }

  return temp
}

export function getQuestionType(item) {
  const questionTypes = Object.keys(QUESTION_TYPES)
  let whichQuestion = ''
  questionTypes.forEach((type) => {
    if (item.flags.includes(type)) whichQuestion = type
  })
  return whichQuestion
}

export function parseQuestionToForm(question, language = PREFERRED_LANGUAGE) {
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

    delete temp.surveyOptions
  }

  temp.isMandatory = temp.flags.includes('IS_MANDATORY')

  return temp
}

export function parseQuestionToApi(question) {
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
  temp.surveyOptions = JSON.stringify(temp.surveyOptions)

  temp.flags = temp.flags.filter((el) => {
    return el !== 'IS_MANDATORY'
  })

  if (temp.isMandatory) temp.flags.push('IS_MANDATORY')

  delete temp.translatedText

  return temp
}
