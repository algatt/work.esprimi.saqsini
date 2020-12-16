export const PREFERRED_LANGUAGE = 'en'

export const SURVEY_OPTIONS = {
  accentColour: '#2563EB',
  backgroundColour: '#FFFFFF',
  textColour: '#000000',
  headerImage: '',
  footerImage: '',
}

export const SURVEY_COLOURS = {
  accentColours: [
    '#2563EB',
    '#DC2626',
    '#FBBF24',
    '#059669',
    '#4F46E5',
    '#7C3AED',
    '#DB2777',
  ],
  backgroundColours: ['#FFFFFF', '#000000'],
  textColours: [
    '#2563EB',
    '#DC2626',
    '#FBBF24',
    '#059669',
    '#4F46E5',
    '#7C3AED',
    '#DB2777',
    '#FFFFFF',
    '#000000',
  ],
}

export const QUESTION_TYPES = {
  SECTION: {
    code: 0,
    text: 'Page',
    flag: 'SECTION',
    icon: 'fas fa-file',
    options: [],
  },
  MULTIPLE_CHOICE: {
    code: 1,
    text: 'Multiple Choice',
    flag: 'MULTIPLE_CHOICE',
    icon: 'fas fa-ellipsis-v',
    options: ['allowOther', 'allowMultiple'],
  },
  LIKERT: {
    code: 2,
    text: 'Likert',
    flag: 'LIKERT',
    icon: 'fas fa-ellipsis-h',
    options: ['showWeights'],
  },
  DROPDOWN: {
    code: 3,
    text: 'Dropdown',
    flag: 'DROPDOWN',
    icon: 'fas fa-chevron-circle-down',
    options: ['allowOther', 'allowMultiple'],
  },
  TYPE_IN: {
    code: 4,
    text: 'Type In',
    flag: 'TYPE_IN',
    icon: 'fas fa-keyboard',
    options: [],
  },
  RANKING: {
    code: 5,
    text: 'Ranking',
    flag: 'RANKING',
    icon: 'fas fa-trophy',
    options: [],
  },
  // RADIO_GRID: {
  //   code: 6,
  //   text: 'Radio Grid',
  //   flag: 'RADIO_GRID',
  //   icon: 'fas fa-grip-horizontal',
  // },
}

export const QUESTION_HELP = {
  NUMBER: 'This is an internal number that can be used for reference.',
  TEXT: 'This is the question text that will be seen by a respondent.',
  NAME:
    'This is an internal name for the question that can be used for reference.',
  REQUIRED:
    'If set to required the respondent must answer the question before progressing.',
}
