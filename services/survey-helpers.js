import {
  PREFERRED_LANGUAGE,
  SURVEY_OPTIONS,
} from '@/assets/settings/survey-settings'
import { DateTime } from 'luxon'

function convertSurveyFromApiToForm(survey, language = PREFERRED_LANGUAGE) {
  if (Object.keys(survey).length === 0) return {}

  const tempSurvey = JSON.parse(JSON.stringify(survey))

  if (!tempSurvey.defaultLanguage) tempSurvey.defaultLanguage = language
  // options
  if (tempSurvey.options) tempSurvey.options = JSON.parse(tempSurvey.options)
  else tempSurvey.options = SURVEY_OPTIONS

  // description
  if (tempSurvey.text) {
    const text = tempSurvey.text.find((el) => {
      return el.language === PREFERRED_LANGUAGE
    })
    if (text && text.text) tempSurvey.textConverted = text.text
  }

  tempSurvey.translatedText = {}

  if (tempSurvey.standardText) {
    tempSurvey.standardText.forEach((el) => {
      const value = el.languages.find((langs) => {
        return langs.language === language
      })
      tempSurvey.translatedText[el.code] = value
    })
  }

  // dates
  if (tempSurvey.validFromTimestamp) {
    const validFromTimestamp = DateTime.fromFormat(
      tempSurvey.validFromTimestamp,
      'yyyy-MM-dd hh:mm:ss ZZZ'
    )

    tempSurvey.validFromDate = validFromTimestamp.toISODate()
    tempSurvey.validFromTime = validFromTimestamp.toLocaleString(
      DateTime.TIME_24_SIMPLE
    )
  }

  if (tempSurvey.validToTimestamp) {
    const validToTimestamp = DateTime.fromFormat(
      tempSurvey.validToTimestamp,
      'yyyy-MM-dd hh:mm:ss ZZZ'
    )

    tempSurvey.validToDate = validToTimestamp.toISODate()
    tempSurvey.validToTime = validToTimestamp.toLocaleString(
      DateTime.TIME_24_SIMPLE
    )
  }

  if (tempSurvey.notificationTimestamp) {
    const notificationTimestamp = DateTime.fromFormat(
      tempSurvey.notificationTimestamp,
      'yyyy-MM-dd hh:mm:ss ZZZ'
    )

    tempSurvey.notificationDate = notificationTimestamp.toISODate()
    tempSurvey.notificationTime = notificationTimestamp.toLocaleString(
      DateTime.TIME_24_SIMPLE
    )
  }

  if (tempSurvey.reminderTimestamp) {
    const reminderTimestamp = DateTime.fromFormat(
      tempSurvey.reminderTimestamp,
      'yyyy-MM-dd hh:mm:ss ZZZ'
    )

    tempSurvey.reminderDate = reminderTimestamp.toISODate()
    tempSurvey.reminderTime = reminderTimestamp.toLocaleString(
      DateTime.TIME_24_SIMPLE
    )
  }

  return tempSurvey
}

function convertSurveyFromFormToApi(survey) {
  if (Object.keys(survey).length === 0) return {}

  const tempSurvey = JSON.parse(JSON.stringify(survey))

  if (!tempSurvey.defaultLanguage)
    tempSurvey.defaultLanguage = PREFERRED_LANGUAGE

  // description
  if (tempSurvey.text.length !== 0) {
    tempSurvey.text.find((el) => {
      return el.language === PREFERRED_LANGUAGE
    }).text = tempSurvey.textConverted
  } else {
    tempSurvey.text = [
      { language: PREFERRED_LANGUAGE, text: tempSurvey.textConverted },
    ]
  }

  delete tempSurvey.textConverted

  // dates
  if (tempSurvey.validFromDate) {
    tempSurvey.validFromTimestamp = DateTime.fromISO(
      `${tempSurvey.validFromDate}T${tempSurvey.validFromTime}`
    ).toFormat('yyyy-MM-dd hh:mm:ssZZZ')
    delete tempSurvey.validFromTime
    delete tempSurvey.validFromDate
  }

  if (tempSurvey.validToDate) {
    tempSurvey.validToTimestamp = DateTime.fromISO(
      `${tempSurvey.validToDate}T${tempSurvey.validToTime}`
    ).toFormat('yyyy-MM-dd hh:mm:ssZZZ')
    delete tempSurvey.validToTime
    delete tempSurvey.validToDate
  }

  if (tempSurvey.notificationDate) {
    tempSurvey.notificationTimestamp = DateTime.fromISO(
      `${tempSurvey.notificationDate}T${tempSurvey.notificationTime}`
    ).toFormat('yyyy-MM-dd hh:mm:ssZZZ')
    delete tempSurvey.notificationDate
    delete tempSurvey.notificationTime
  }

  if (tempSurvey.reminderDate) {
    tempSurvey.reminderTimestamp = DateTime.fromISO(
      `${tempSurvey.reminderDate}T${tempSurvey.reminderTime}`
    ).toFormat('yyyy-MM-dd hh:mm:ssZZZ')
    delete tempSurvey.reminderDate
    delete tempSurvey.reminderTime
  }

  // options
  if (!tempSurvey.options) {
    tempSurvey.options = SURVEY_OPTIONS
  }
  tempSurvey.options = JSON.stringify(tempSurvey.options)

  if (tempSurvey.categoryCode) delete tempSurvey.categoryCode

  return tempSurvey
}

export { convertSurveyFromFormToApi, convertSurveyFromApiToForm }
