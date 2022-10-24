# Mangrove Restoration Tracking Tool (MRTT) User Interface

## Product Description and Motivation

Global Mangrove Watch's Mangrove Restoration Tracking Tool (MRTT) is a data entry tool that is part of an online platform that provides access to remote sensing data and tools for monitoring mangroves, necessary for their conservation and management. It gives universal access to near real-time information on where mangroves are and what changes there have been to their distribution across the world and highlights why they are valuable.

You can view the data that the MRTT app creates [here](https://globalmangrovewatch.org/).

The project board for this work can be found [here](https://github.com/Vizzuality/mangrove-atlas/issues)

## Tech Stack and Dependencies Worth Noting

- React
- Emotion to manage styling
- MUI for user already styled user interface components
- React-toastify
- React Hook Form
- Yup for form validation
- Eslint, Prettier, and Husky to manage git hooks
- Mapbox to draw mangrove site locations.
- [The Global Mangrove Watch API](https://github.com/globalmangrovewatch/gmw-api) to handle data on the server side
- Transifex for user language translation.

## Archetectural Decisions and Tradeoffs

- Translation will be provided via Transifex which is configured at `mrtt-ui/public/index.html`. This is unlikely to translate dynamically generated text, so we included a language file (`mrtt-ui/src/language.js`)for easy future translation. We attempted to put all user facing text in the language file, but in some places it is hardcoded in the JSX
- Theming is configured in two files.
  - `mrtt-ui/src/styles/themeMui.js` is responsible for setting style defaults for MUI components
  - `mrtt-ui/src/styles/theme.js` is for all other style tokens. `themeMui.js` should import tokens from `theme.js`
- This project had a very tight timeline, so it was decided that we skip writing front end tests.
- The various site data items/form questions and answers have numerical ids based on question order on the server side. It was decided that the front end would use descriptive naming for coding these questions and answers. We map the descriptive names to the ids used on the server in the `mrtt-ui/src/library/mapDataForApi.js` file using a a lookup object found here: `mrtt-ui/src/data/questionMapping.js`.
- In order for the `QuestionNav` (`mrtt-ui/src/components/QuestionNav.js`) component to work properly, this constants file needs to list all the forms by id in order here: `mrtt-ui/src/constants/sectionNames.js`
- a convienience custom hook is used to load _most_ data for a given form.
  - for forms 1-7, `mrtt-ui/src/library/useInitializeQuestionMappedFormjs`. This hook calls a provided callback function with the server response for supplimental form data parsing.
  - for forms 8-10, `mrtt-ui/src/library/useInitializeMonitoringForm.js`. This hook to-date does not include a callback because those forms happened not to need it.
- A date picker was created using MUI and Luxon to display and save all dates in UTC. Any timestamps saved should be ignored as false precision. `mrtt-ui/src/components/DatePickerUtcMui.js`

## Setting Up and Running a Development Environment

These instructions assume familarity with React and Create React App

1. Create a file called `.env` in the root folder (the same folder as this readme). Copy the keys from `env.sample`. Values for `.env` will need to be obtained from the repo custodian.
1. Run `npm install`
1. Run `npm start`. This should open a browser at in development mode.

- If a browser doesnt automatically open, you can view the app at [http://localhost:3000](http://localhost:3000).

## Deploying the app

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
