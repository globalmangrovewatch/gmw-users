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

## Architectural Decisions and Tradeoffs

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

### Keeping the session across reloads (local SSO with GMW)

MRTT keeps the API bearer token **in memory only**. It is never written to `localStorage`, `sessionStorage` or a cookie the app can read. After a page reload the session is restored through the Global Mangrove Watch app (`mangrove-atlas`), which holds the token in a 30-day `httpOnly` cookie on `.globalmangrovewatch.org`:

1. `AuthProvider` loads `${REACT_APP_GMW_URL}/api/auth/sso/authorize` in a hidden iframe.
2. If GMW has a session it redirects back to `/auth/sso-silent?code=…` with a short-lived code, which the iframe posts to the parent window.
3. MRTT exchanges the code at `/api/auth/sso/exchange` and keeps the token in memory.

After an email/password login MRTT also pushes the token to GMW (`/api/auth/sso/sync`), so the next reload is restored the same way. If GMW is not reachable the silent check gives up after 4 seconds and the login form is shown.

**Consequence for local development:** if `REACT_APP_GMW_URL` points at an instance of GMW that is not running, or at MRTT itself (`http://localhost:3000`), every reload logs you out. To keep the session locally, give MRTT a real GMW to talk to:

**Option A: run GMW locally**

1. Clone and run [`mangrove-atlas`](https://github.com/Vizzuality/mangrove-atlas) (`pnpm dev`, port 3000). In its `.env`:
   - `AUTH_API_URL` must be the same backend as MRTT's `REACT_APP_AUTH_URL`.
   - `NEXTAUTH_URL=http://localhost:3000`
   - `SSO_ALLOWED_ORIGINS=http://localhost:3001` (the MRTT origin; it feeds `frame-ancestors`, the `redirect_uri` allowlist and CORS on the SSO endpoints).
2. Run MRTT on another port: `PORT=3001 pnpm start`, with `REACT_APP_GMW_URL=http://localhost:3000` in MRTT's `.env`.
3. Log in to MRTT (or to GMW) and reload: you stay logged in.

**Option B: use the staging GMW**

Set `REACT_APP_GMW_URL` to the staging GMW URL and ask the GMW maintainers to add your MRTT origin (for example `http://localhost:3001`) to the `SSO_ALLOWED_ORIGINS` config var of that deployment. The browser must allow third-party cookies for the GMW origin for the iframe handshake to work.

Do not "fix" this by persisting the token in web storage: that re-exposes it to any script running on the MRTT origin and cannot see logouts done on the GMW side. See GMW-1149.

## Deploying the app

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
