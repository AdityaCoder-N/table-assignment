
# React + TypeScript + Vite Data Table Implementation

This project demonstrates two different approaches to implementing a data table component with lazy loading and row selection functionality using React, TypeScript, and Vite.

## Table Components

Both the components have these features but implement it differently:

- Lazy loading of data from an API
- Pagination
- Row selection across multiple pages
- Overlay for selecting a specific number of rows

### 1. TableComponent 1

This component implements a data table with the following Logic:

- Uses `useFetch` hook to fetch data for each page
- Implements a delayed row selection strategy
- Selects rows when navigating to pages where rows should be selected
- Maintains selection state across page changes
- Reduces load on API because it selects data only when user navigates to the page where data should be selected.

### 2. TableComponent 2 - No Extra Logic

This uses a straight forward approach using memoization to enhance performance.

Key Differences :
- Uses `useCallback` and `useMemo` for better performance
- On submission of overlay input, it fetches extra data from API to get selected.

Both components ensure that:
1. There is no variable holding all fetched rows to prevent memory issues
2. Data is fetched from the API on every page change
3. Row selection and deselection persist across different pages

## Implementation Details

- The components use PrimeReact's DataTable for rendering the table
- Custom hooks (`useFetch`) are used for data fetching
- React's `useState` and `useEffect` hooks manage component state and side effects
- The table displays artwork data with columns for title, origin, artist, inscriptions, and dates

## Key Features

- Lazy Loading: Data is fetched only for the current page, reducing initial load time and memory usage
- Persistent Selection: Selected rows are remembered even when navigating between pages
- Customizable Row Selection: Users can specify the number of rows to select across pages
- Error Handling: Displays user-friendly error messages if data fetching fails

## Performance Considerations

- Memoization techniques are used to prevent unnecessary re-renders


## Setup and Usage

- Clone the repo using 'git clone'
- Install packages using 'npm install'
- Run the project using 'npm run dev'

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

Configure the top-level parserOptions property like this:

export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
Replace tseslint.configs.recommended to tseslint.configs.recommendedTypeChecked or tseslint.configs.strictTypeChecked
Optionally add ...tseslint.configs.stylisticTypeChecked
Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})

This implementation provides a robust and performant solution for handling large datasets in a table format with advanced selection capabilities.