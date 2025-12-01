# Tooling

This document describes at a high level some the key tools used across `near-js`.

## Package Manager - [Bun](https://bun.sh/)
Bun is a fast all-in-one JavaScript runtime and toolkit with a built-in bundler, test runner, and Node.js-compatible package manager. It provides significantly faster package installations compared to npm, yarn, or pnpm while maintaining full compatibility with the npm ecosystem.

## Package Publishing - [Changesets](https://github.com/changesets/changesets)
Changesets manages package versioning, changelog generation, and publishing to the package registry. Changesets provides a CLI to simplify bumping packages and adding changelog entries, it then automates versioning and publishing via GitHub Actions.

## Automation - [GitHub Actions](https://github.com/features/actions)
Github Actions is used to automate various tasks including PR checks (linting, type checks, and tests), docs generation, and also releasing packages to NPM.
