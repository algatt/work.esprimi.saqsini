export const PREFERRED_LANGUAGE = 'en'

export const SURVEY_COLOURS = {
  themes: [
    {
      name: 'blue',
      textColour: 'text-gray-700',
      background: 'bg-gradient-to-br from-blue-500 to-blue-700',
      accentText: 'text-blue-600',
      accentBackground: 'bg-blue-600',
      borderColour: 'border-blue-600',
      buttons:
        'bg-blue-600 text-white hover:text-blue-600 hover:bg-white active:text-blue-600 active:bg-white transition duration-300 border-2 border-transparent hover:border-blue-600 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-transparent ',
    },
    {
      name: 'red',
      textColour: 'text-gray-700',
      background: 'bg-gradient-to-br from-red-500 to-red-700',
      accentText: 'text-red-600',
      accentBackground: 'bg-red-600',
      borderColour: 'border-red-600',
      buttons:
        'bg-red-600 text-white hover:text-red-600 hover:bg-white active:text-red-600 active:bg-white transition duration-300 border-2 border-transparent hover:border-red-600 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-transparent ',
    },
    {
      name: 'pink',
      textColour: 'text-gray-700',
      background: 'bg-gradient-to-br from-pink-500 to-pink-700',
      accentText: 'text-pink-600',
      accentBackground: 'bg-pink-600',
      borderColour: 'border-pink-600',
      buttons:
        'bg-pink-600 text-white hover:text-pink-600 hover:bg-white active:text-pink-600 active:bg-white transition duration-300 border-2 border-transparent hover:border-pink-600 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-transparent ',
    },
    {
      name: 'green',
      textColour: 'text-gray-700',
      background: 'bg-gradient-to-r from-green-500 to-green-700',
      accentText: 'text-green-600',
      accentBackground: 'bg-green-600',
      borderColour: 'border-green-600',
      buttons:
        'bg-green-600 text-white hover:text-green-600 hover:bg-white active:text-green-600 active:bg-white transition duration-300 border-2 border-transparent hover:border-green-600 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-transparent ',
    },
    {
      name: 'gray',
      textColour: 'text-gray-700',
      background: 'bg-gradient-to-r from-gray-500 to-gray-700',
      accentText: 'text-gray-600',
      accentBackground: 'bg-gray-600',
      borderColour: 'border-gray-600',
      buttons:
        'bg-gray-600 text-white hover:text-gray-600 hover:bg-white active:text-gray-600 active:bg-white transition duration-300 border-2 border-transparent hover:border-gray-600 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-transparent ',
    },
    {
      name: 'yellow',
      textColour: 'text-gray-700',
      background: 'bg-gradient-to-r from-yellow-500 to-yellow-700',
      accentText: 'text-yellow-600',
      accentBackground: 'bg-yellow-600',
      borderColour: 'border-yellow-600',
      buttons:
        'bg-yellow-600 text-white hover:text-yellow-600 hover:bg-white active:text-yellow-600 active:bg-white transition duration-300 border-2 border-transparent hover:border-yellow-600 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-transparent ',
    },
    {
      name: 'indigo',
      textColour: 'text-gray-700',
      background: 'bg-gradient-to-r from-indigo-500 to-indigo-700',
      accentText: 'text-indigo-600',
      accentBackground: 'bg-indigo-600',
      borderColour: 'border-indigo-600',
      buttons:
        'bg-indigo-600 text-white hover:text-indigo-600 hover:bg-white active:text-indigo-600 active:bg-white transition duration-300 border-2 border-transparent hover:border-indigo-600 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-transparent ',
    },
    {
      name: 'purple',
      textColour: 'text-gray-700',
      background: 'bg-gradient-to-r from-purple-500 to-purple-700',
      accentText: 'text-purple-600',
      accentBackground: 'bg-purple-600',
      borderColour: 'border-purple-600',
      buttons:
        'bg-purple-600 text-white hover:text-purple-600 hover:bg-white active:text-purple-600 active:bg-white transition duration-300 border-2 border-transparent hover:border-purple-600 disabled:bg-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed disabled:border-transparent ',
    },
  ],

  accentColours: [
    '#3B82F6',
    '#EF4444',
    '#F59E0B',
    '#10B981',
    '#8B5CF6',
    '#EC4899',
  ],
  backgroundColours: [
    '#DBEAFE',
    '#FEE2E2',
    '#FEF3C7',
    '#D1FAE5',
    '#EDE9FE',
    '#FCE7F3',
  ],
  textColours: ['#4B5563'],
}
export const SURVEY_OPTIONS = {
  // accentColour: SURVEY_COLOURS.accentColours[0],
  // backgroundColour: SURVEY_COLOURS.backgroundColours[0],
  // textColour: SURVEY_COLOURS.textColours[0],
  headerImage: '',
  footerImage: '',
  redirectURL: '',
  theme: SURVEY_COLOURS.themes[0],
}

export const QUESTION_TYPES = {
  SECTION: {
    code: 0,
    text: 'Page',
    flag: 'SECTION',
    icon: 'fas fa-file fa-fw',
    options: [],
    component: 'NewQuestionSection',
  },
  MULTIPLE_CHOICE: {
    code: 1,
    text: 'Multiple Choice',
    flag: 'MULTIPLE_CHOICE',
    icon: 'fas fa-ellipsis-v fa-fw',
    options: ['allowOther', 'allowMultiple'],
    component: 'NewQuestionMultipleChoice',
  },
  LIKERT: {
    code: 2,
    text: 'Likert',
    flag: 'LIKERT',
    icon: 'fas fa-ellipsis-h fa-fw',
    options: ['showWeights'],
    component: 'NewQuestionLikert',
  },
  DROPDOWN: {
    code: 3,
    text: 'Dropdown',
    flag: 'DROPDOWN',
    icon: 'fas fa-chevron-circle-down fa-fw',
    options: ['allowOther', 'allowMultiple'],
    component: 'NewQuestionDropDown',
  },
  TYPE_IN: {
    code: 4,
    text: 'Type In',
    flag: 'TYPE_IN',
    icon: 'fas fa-keyboard fa-fw',
    options: [],
    component: 'NewQuestionTypeIn',
  },
  RANKING: {
    code: 5,
    text: 'Ranking',
    flag: 'RANKING',
    icon: 'fas fa-trophy fa-fw',
    options: [],
    component: 'NewQuestionRanking',
  },
  RADIO_GRID: {
    code: 6,
    text: 'Radio Grid',
    flag: 'RADIO_GRID',
    icon: 'fas fa-grip-horizontal fa-fw',
    options: [],
    component: 'NewQuestionRadioGrid',
  },
  MULTIPLE_CHOICE_IMAGE: {
    code: 7,
    text: 'Multiple Choice (Images)',
    flag: 'MULTIPLE_CHOICE_IMAGE',
    icon: 'fas fa-image fa-fw',
    options: ['allowMultiple', 'isMultipleChoiceImage'],
    component: 'NewQuestionMultipleChoiceImage',
  },
}

export const QUESTION_HELP = {
  NUMBER: 'This is an internal number that can be used for reference.',
  TEXT: 'This is the question text that will be seen by a respondent.',
  NAME:
    'This is an internal name for the question that can be used for reference.',
  REQUIRED:
    'If set to yes the respondent must answer the question before progressing.',
}

export const NOTIFICATION_EDITOR_FIELDS = [
  'Gender',
  'Age',
  'Full Name',
  'Sector Name',
  'Industry Name',
  'Company Name',
  'Company Abbreviation',
  'Department Name',
  'Department Abbreviation',
  'Role Name',
  'Role Abbreviation',
]

export const SURVEY_LANGUAGE_GENERIC_TERMS = {
  survey_title: 0,
  clear: 1,
  next: 2,
  previous: 3,
  finish: 4,
  not_selected: 5,
  ranking_instructions: 6,
  required: 7,
  position: 8,
  start: 9,
  disqualify: 10,
}

export const USER_META_DATA = {
  navigator: [
    'appCodeName',
    'appVersion',
    'buildId',
    'cookieEnabled',
    'doNotTrack',
    'language',
    'languages',
    'maxTouchPoints',
    'oscpu',
    'platform',
    'userAgent',
  ],
  window: ['fullScreen', 'innerHeight', 'innerWidth'],
}

export const FILTER_NAMES = {
  companies: 'Company Name',
  departments: 'Department Name',
  industries: 'Industry Name',
  roles: 'Role Name',
  sectors: 'Sector Name',
  age: 'Age',
  gender: 'Gender',
}
