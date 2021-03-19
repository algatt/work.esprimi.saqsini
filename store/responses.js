export const state = () => ({
  items: [],
})

export const actions = {
  getResponses({ commit }, code) {
    commit(
      'setItems',
      {
        which: 'responses',
        items: {
          survey: {},
          questions: [
            {
              question: {
                code: 1,
                text: 'Do you like fruit?',
                name: 'Fruit Like',
                type: 'MULTIPLE_CHOICE',
                number: 1,
                availableOptions: [
                  {
                    text: 'Orange',
                    value: 'Orange',
                  },
                  { text: 'Apple', value: 'Apple' },
                  { text: 'Kiwi', value: 'Kiwi' },
                ],
              },
              responses: [
                {
                  contact: {
                    age: 32,
                    gender: 'Female',
                    role: 'CEO',
                    department: 'Marketing',
                    company: 'Actavis',
                  },
                  chosenOption: ['Apple'],
                },
                {
                  contact: {
                    age: 42,
                    gender: 'Male',
                    role: 'Accountant',
                    department: 'Accounts',
                    company: 'Actavis',
                  },
                  chosenOption: ['Orange'],
                },
                {
                  contact: {
                    age: 22,
                    gender: 'Male',
                  },
                  chosenOption: ['Orange'],
                },
              ],
            },
            {
              question: {
                code: 2,
                text: 'How do you rate Vanilla?',
                name: 'Vanilla Like',
                type: 'LIKERT_SCALE',
                number: 2,
                availableOptions: [
                  { text: 'I like it a lot', value: 3 },
                  { text: 'Indifferent', value: 2 },
                  { text: 'I do not like it', value: 1 },
                ],
              },
              responses: [
                {
                  contact: {
                    age: 32,
                    gender: 'Female',
                    role: 'CEO',
                    department: 'Marketing',
                    company: 'Actavis',
                  },
                  chosenOption: [3],
                },
                {
                  contact: {
                    age: 42,
                    gender: 'Male',
                    role: 'Accountant',
                    department: 'Accounts',
                    company: 'Actavis',
                  },
                  chosenOption: [2],
                },
                {
                  contact: {
                    age: 22,
                    gender: 'Male',
                  },
                  chosenOption: [2],
                },
              ],
            },
          ],
        },
      },
      { root: true }
    )
  },
}
