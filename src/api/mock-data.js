import { addDays, format, startOfISOWeek, startOfMonth } from 'date-fns'

const data = [
  {
    name: 'TASK01',
    description: 'Lorem Ipsum',
    taskId: 1,
    hidden: false,
    commits: []
  },
  {
    name: 'TASK02',
    description: 'Dolor sit amet',
    taskId: 2,
    hidden: false,
    commits: []
  },
  {
    name: 'TASK03',
    description: 'Consectetur adipiscing elit',
    taskId: 3,
    hidden: false,
    commits: []
  },
  {
    name: 'TASK04',
    description: 'Can not repro, but may happen :)',
    taskId: 4,
    hidden: false,
    commits: []
  },
  {
    name: 'TASK05',
    description: 'Sed do eiusmod',
    taskId: 5,
    hidden: false,
    commits: []
  },
  {
    name: 'TASK06',
    description: 'Tempor incididunt ut labore et dolore magna aliqua',
    taskId: 6,
    hidden: false,
    commits: []
  },
  {
    name: 'TASK07',
    description: 'Ut enim ad minim veniam',
    taskId: 7,
    hidden: false,
    commits: []
  },
  {
    name: 'TASK08',
    description: 'Quis nostrud exercitation',
    taskId: 8,
    hidden: false,
    commits: []
  }
]
const start = startOfISOWeek(startOfMonth(new Date()))
function getRandomHours (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
data.forEach(task => {
  for (let i = 0; i < 35; i++) {
    task.commits.push({
      date: format(addDays(start, i), 'YYYY-MM-DD'),
      hours: getRandomHours(0, 4)
    })
  }
})

export const tasks = data

export const status = [
  {
    developer: 'Developer_1',
    name: 'TASK01',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_1',
    name: 'TASK02',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_1',
    name: 'TASK03',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_1',
    name: 'TASK04',
    description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_1',
    name: 'TASK05',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_2',
    name: 'TASK06',
    description: 'totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_2',
    name: 'TASK07',
    description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_2',
    name: 'TASK08',
    description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_2',
    name: 'TASK09',
    description: 'sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_2',
    name: 'TASK10',
    description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_3',
    name: 'TASK11',
    description: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_3',
    name: 'TASK12',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_3',
    name: 'TASK13',
    description: 'deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_3',
    name: 'TASK14',
    description: 'similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_3',
    name: 'TASK15',
    description: 'Et harum quidem rerum facilis est et expedita distinctio.',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_4',
    name: 'TASK16',
    description: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_4',
    name: 'TASK17',
    description: 'omnis voluptas assumenda est, omnis dolor repellendus',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_4',
    name: 'TASK18',
    description: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. ',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_4',
    name: 'TASK19',
    description: 'Itaque earum rerum hic tenetur a sapiente delectus',
    remaining: '0.0',
    progress: '1'
  },
  {
    developer: 'Developer_4',
    name: 'TASK20',
    description: 'ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat',
    remaining: '0.0',
    progress: '1'
  }
]
export const tenrox = [
  {
    contractor: 'TimeSheet User',
    from: '2018-02-26',
    to: '2018-03-04',
    tenrox: 40,
    timesheet: 40
  },
  {
    contractor: 'TimeSheet User',
    from: '2018-03-05',
    to: '2018-03-11',
    tenrox: 24,
    timesheet: 24
  },
  {
    contractor: 'TimeSheet User',
    from: '2018-03-12',
    to: '2018-03-18',
    tenrox: 40,
    timesheet: 40
  },
  {
    contractor: 'TimeSheet User',
    from: '2018-03-19',
    to: '2018-03-25',
    tenrox: 32,
    timesheet: 40,
    invalid: true
  },
  {
    contractor: 'TimeSheet User',
    from: '2018-03-26',
    to: '2018-04-01',
    tenrox: 40,
    timesheet: 40
  }
]
