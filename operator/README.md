# ORIENT Web Application for Operators

## Development

1. ~~Connect UI library using `yarn link orient-ui-library`~~

1. Install dependencies using `yarn install`

1. Start development server using `yarn start`

1. Open http://localhost:1244/ in your favourite browser

1. Write a some great thing! You can generate components using `yarn generate NewGreatThing`

1. Make a commit. Code linter and prettier will be runs automatically

## Scripts

#### `yarn build`

Builds production bundle into the `dist` folder

#### `yarn start`

Runs application with development environment

#### `yarn lint`

Runs code linter. To fix issues that could be fixed automatically, use the `yarn lint:fix` command

#### `yarn prettier`

Check the code style. Use the `yarn prettier:fix` command to fix code style automatically

#### `yarn generate <ComponentName>`

Generate a component draft, for example `yarn generate SampleThing`

## Tech stack

- React-based application
- UI Framework: [And Design](https://ant.design)
- State management: Redux with [easy-peasy](https://github.com/ctrlplusb/easy-peasy) on top
- Router: [react-router](https://github.com/remix-run/react-router)
- Code purity: [ESLint](https://eslint.org/) and [prettier](https://prettier.io/)
- Helper libs: [dayjs](https://day.js.org/), [axios](https://github.com/axios/axios)
