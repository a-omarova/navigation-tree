Hello! This is a small example of a navigation tree bar.

This project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
I choose Next Js because is fast, has SSR, and allows fast configuration webpack and babel. Easy deployment (thanks Vercel) and easy routing is a value too but didn't use for this project

## How to run the project

First, run the client and server:

```bash
npm run dev
```

This project uses a very small and simple local server for a request like
- search,
- get top level nodes
- each node's child individually.

For better demo loading status, all requests have setTimeout delay. Except for requests on Search - there setTimout added for pending user stops typing

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Styles

Next.js has built-in support for CSS Modules allowing you to write scoped CSS by automatically creating a unique class name.
Colors for the project placed in [`styles/global`], created as CSS Variables.

## Testing

As a testing tool, I used Cypress. For run tests:


```bash
npm run cypress
```

P.S. sometimes test failed because setTimeout. Just rerun tests

## What is implemented

- Data in JSON is loaded asynchronously from a local web server
- The user can see the “preload” until the data is rendered.
- When the user clicks on the root element of the branch or the arrow next to it, the nested list collapses/expands.
- Smooth animations for changing colors and changing the position of the icon.
- E2e tests for navigation
- Selecting the active item by ID
- Filtering items (Search)
- While waiting for rendering, the loading indicator is displayed
- The results of the search show after the user stop typing
- Small easter egg in search
