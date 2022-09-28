# Tooling

This document describes at a high level some the key tools used across `near-js`.

## Package Manager - [PNPM](https://pnpm.io/)
PNPM is a package manager focused on fast installations while still being disk efficient. It manages dependency installations across the monorepo as well as linking interdependent packages. Unlike other package managers, PNPM creates a non-flat `node_modules` structure which ensures packages only have access to dependencies defined in their `package.json`.

## Build System - [Turborepo](https://turborepo.org/)
Turborepo provides tooling for orchestrating commands across the monorepo. Similar to Yarn Workspaces, Turborepo can run tasks within each project via a single command, but rather than executing serially, Turborepo has various performance enhancing features such as task parallelization and local/remote caching.

## Package Publishing - [Changesets](https://github.com/changesets/changesets)
Changesets manages package versioning, changelog generation, and publishing to the package registry. Changesets provides a CLI to simplify bumping packages and adding changelog entries, it then automates versioning and publishing via GitHub Actions.

## Automation - [GitHub Actions](https://github.com/features/actions)
Github Actions is used to automate various tasks including PR checks (linting, type checks, and tests), docs generation, and also releasing packages to NPM.
