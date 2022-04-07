## Development

1. Install dependencies using `yarn install`

1. Start development server using `yarn start`

1. Open http://localhost:1234/ in your favorite browser

1. Write a some great thing! You can generate component draft using `yarn generate NewGreatThing`

1. Make a commit. Code linter and prettier will be runs automatically

## Scripts

#### `yarn build`

Builds production bundle into `dist` folder

#### `yarn start`

Runs development Web Server

#### `yarn lint`

Runs code linter. To apply possible use the `yarn lint:fix` command

#### `yarn prettier`

Check code style. Use the `yarn prettier:fix` command to apply code style automatically

#### `yarn generate <ComponentName>`

Generates component draft, for example `yarn generate Sample`

## Tech stack

- React-based application
- UI Framework: [And Design](https://ant.design)
- State management: Redux with [easy-peasy](https://github.com/ctrlplusb/easy-peasy) on top
- Router: [react-router](https://github.com/remix-run/react-router)
- Code purity: [ESLint](https://eslint.org/) and [prettier](https://prettier.io/)
- Helper libs: [dayjs](https://day.js.org/), [superagent](https://github.com/visionmedia/superagent)
