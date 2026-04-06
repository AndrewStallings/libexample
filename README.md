# Library Example

This repo is a starter pattern for teams building many CRUD-heavy web apps with shared infrastructure.

## Repo shape

- `packages/our-lib`: the publishable shared library package
- `app` + `src/features`: the example Next app consuming that package locally

## What this demonstrates

- Reusable DAL contracts that do not force the UI to know about Drizzle.
- Zod-first schemas for runtime validation and TypeScript inference.
- A card-plus-form workflow that can cover a large percentage of line-of-business screens.
- Local unit tests that use in-memory repositories instead of a database.
- An escape hatch: teams can replace any generated or default behavior with custom components, custom services, or direct repository calls.

## Testing philosophy

The important part is not testing this demo app by itself. The intended pattern is that apps using the shared library should be able to:

- test services with in-memory repositories or mocked repositories
- test React screens with `@testing-library/react`
- avoid any database dependency in unit tests
- optionally share lightweight helpers such as fixtures and small form interaction helpers

## Suggested library test layout

- `src/features/<feature>/__tests__`: feature-level tests for services, schemas, and form behavior
- `packages/our-lib/src/**/__tests__`: shared library component and helper tests
- `src/testing`: shared harnesses, mocks, and fixtures that both this library and consuming apps can mirror

This structure scales better once multiple CRUD resources and multiple form features already exist, because it separates shared-library tests from app-page concerns without forcing everything into one global test folder.

## Package entry points

The library can be consumed either from the root entry point or from narrower subpaths:

- `our-lib`
- `our-lib/cards`
- `our-lib/forms`
- `our-lib/dal`
- `our-lib/testing`

The narrower entry points are useful when you want the package structure to stay obvious to consumers as the library grows.

## Why these dependencies

- `next`, `react`, `react-dom`: matches the intended app platform.
- `@tanstack/react-form`: good fit for reusable, field-driven forms with field-level validation and subscriptions.
- `zod`: one schema for parsing, validation, and type inference.
- `drizzle-orm`: strongly typed SQL layer and a better path for keeping application models camelCase while mapping database columns independently.
- `tailwindcss`: fast UI composition without locking the library to a heavyweight component framework.
- `vitest` + `@testing-library/react` + `jsdom`: fast local unit tests for services and React components without any database dependency.

## Important design note

React should usually stay as a peer dependency in a published shared library, because the host app should control the React version. In this example repo everything is in one app for simplicity, so React is listed as a direct dependency.
