# Raidsmith

Mitigation and (eventually) static gear planner for FFXIV. Meant to replace multiple google sheets.

Very much a work in progress.

## Prerequisites

The server requires a Bun runtime >= 1.0.12. You can install all other dependencies with `bun install`

## Project Information

### Major Dependencies
```
bun (>= 1.0.12) - Runtime for server, build scripts
react           - Frontend SPA
sqlite          - Persistence
vite            - Asset builds
eslint          - Linting
```

### Project Layout
```
| index.html           - Template for page render. Assumes SPA.
| raidsmith.sqlite     - Created at server runtime, persistence for storage.
| dist                 - Build files
| public               - Static files, to be minified and placed in dist on build 
| server               - Server code.
| src                  - Frontend application code.
```

### Scripts
```
| dev                  - Run asset builder in watch mode, includes sourcemaps
| build                - Run asset builder for production
| lint                 - Lint 
| serve                - Run server
```

### Communication and data description

The data for the application is split into two segments, a hard cache for storing the application state and a list of JSON patches (RFC 6902) for rebuilding state.

Primary communication is updates in the JSON Patch format over websockets. Update messages sent by user will be forwarded to all users on the same nonce.

## Development instructions:

To start the server, invoke `bun run serve`.
To watch for changes, invoke `bun run dev`.

Tests are (potentially perpetually) TBD. Best practice was thrown out the window by the first line of code, let's be honest.

## Contributors and Thanks

### Major Contributors

   * Nicholas Guarino (ndguarino) - Base design, initial implementation, initial WHM data

### Special Thanks

   * Aether Hunt Ruiners - Inspiration, memes, data
     * Fjola Tachikake - initial SCH data
     * Rylanor Imperius - initial RPR data, accessibility testing
     * Kanrai Tachikake - initial SAM data
     * Seela Bilen - initial GNB data, accessibility testing
   * Kai Sorellan - Accessibility testing