# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)




## Recycler Dashboard: Errors & Fixes

### Overview
- This section documents the functional errors originally present in the Recycler dashboard and the changes made to resolve them.
- UI palette and minor visual fixes are summarized briefly at the end; the focus here is on data, auth, and behavior fixes.

### Errors and How They Were Fixed
- Authentication header mismatch (401s across endpoints)
  - Problem: Some pages used manual headers or none; backend expects `x-auth-token`, causing unauthorized responses and failed data loads.
  - Fix: Centralized a shared HTTP client that injects `x-auth-token` from localStorage for every request.
    - Client setup: `client/src/api/axios.js:8–16` adds a request interceptor to set `x-auth-token`.
    - Pages and services updated to use the shared client:
      - Dashboard fetch via shared client: `client/src/pages/RecyclerDashboard/RecyclerDashboardHome.js:31–36`.
      - Recycler service functions import the shared client: `client/src/api/recyclerService.js:2–5`.

- Duplicate `/api` in service base paths (404/failed loads)
  - Problem: Services were building URLs with a duplicated `/api`, breaking requests like pickups and communication.
  - Fix: Standardized base URL to `http://localhost:5001/api` and used relative service paths without repeating `/api`.
    - Base URL: `client/src/api/axios.js:4–6`.
    - Pickups and route paths: `client/src/api/recyclerService.js:4`.
    - Customer communication paths: `client/src/api/customerCommunicationService.js:4`.

- Today’s Route showed red errors for non-critical failures
  - Problem: Any route optimization failure raised a top-level red error, even when data could be shown in a fallback order.
  - Fix: Error handling now distinguishes authorization failures from other issues; only 401 shows an error, others fall back to empty or database order.
    - Fetch and guard: `client/src/pages/RecyclerDashboard/TodayRoute.js:66–81`.
    - Successful fetch, geometry mapping: `client/src/pages/RecyclerDashboard/TodayRoute.js:45–53`.
    - Completed stops initialization: `client/src/pages/RecyclerDashboard/TodayRoute.js:53–61`.
    - Graceful empty-state handling: `client/src/pages/RecyclerDashboard/TodayRoute.js:61–65`.

- Schedule & History “Failed to load pickups”
  - Problem: Requests failed due to base path duplication and inconsistent date field usage.
  - Fixes:
    - Use the corrected service base path (see service fixes above).
    - Normalized filter query assembly and error messages.
    - Render dates consistently from `pickup.date`.
    - Filtering and errors: `client/src/pages/RecyclerDashboard/ScheduleHistory.js:51–66`.
    - Table date rendering: `client/src/pages/RecyclerDashboard/ScheduleHistory.js:422–424`.

- Customer Communication “Failed to load customer communication data”
  - Problem: Same duplicate base path issue; tabs didn’t switch correctly.
  - Fixes:
    - Corrected service base paths for customers and announcements.
    - Normalized error handling and wiring of the tab change handler.
    - Service endpoints: `client/src/api/customerCommunicationService.js:4–12`, `15–21`, `24–33`.
    - Tab switching: `client/src/pages/RecyclerDashboard/CustomerCommunication.js:112–121`.
    - Fetch and errors: `client/src/pages/RecyclerDashboard/CustomerCommunication.js:31–50`.

- Can’t post announcements when there are no customers
  - Behavior: The send button is intentionally disabled when the customer list is empty (requires completed pickups to build the audience). Not a bug; clarified behavior.

### UI Fixes (Brief)
- Replaced remaining non-theme colors with the forest palette across pages.
- Standardized buttons, badges, alerts, and headings for visual consistency.
- Key examples:
  - Today’s Route palette and current stop accents: `client/src/pages/RecyclerDashboard/TodayRoute.js`.
  - Schedule & History table header and controls: `client/src/pages/RecyclerDashboard/ScheduleHistory.js`.
  - Sidebar/brand in recycler layout: `client/src/layouts/RecyclerLayout/RecyclerLayout.js`.

### Notes
- Backend runs on port `5001` with base API path `/api`; the client points to it via `client/src/api/axios.js`.
- Route optimization failures may appear in backend logs; the frontend shows a graceful fallback unless the error is an authorization failure.
