# ORIENT Web Application for Operators

## Development

1. ~~Connect UI library using `npm link orient-ui-library`~~

1. Install dependencies using `npm install`

1. Start development server using `npm start`

1. Open http://localhost:1244/ in your favourite browser

1. Write a some great thing! You can generate components using `npm generate NewGreatThing`

1. Make a commit. Code linter and prettier will be runs automatically

## Scripts

*NOTE: part of monorepo, use parent project for run scripts*

#### `npm build`

Builds production bundle into the `dist` folder

#### `npm start`

Runs application with development environment

#### `npm lint`

Runs code linter. To fix issues that could be fixed automatically, use the `npm lint:fix` command

#### `npm prettier`

Check the code style. Use the `npm prettier:fix` command to fix code style automatically

#### `npm generate <ComponentName>`

Generate a component draft, for example `npm generate SampleThing`

## Tech stack

- React-based application
- UI Framework: [And Design](https://ant.design)
- State management: Redux with [easy-peasy](https://github.com/ctrlplusb/easy-peasy) on top
- Router: [react-router](https://github.com/remix-run/react-router)
- Code purity: [ESLint](https://eslint.org/) and [prettier](https://prettier.io/)
- Helper libs: [dayjs](https://day.js.org/), [axios](https://github.com/axios/axios)
