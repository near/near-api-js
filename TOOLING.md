# Tooling

This document describes at a high level some the key tools used across `near-js`.

## Package Manager - [Bun](https://bun.sh/)
Bun powers dependency installation and workspace orchestration for the monorepo. Its built-in workspaces keep packages linked together without the extra configuration that pnpm required, and installs complete in just a few seconds.

## Build System - TypeScript (`tsc`)
Each package compiles directly with the TypeScript compiler via `bun run build`. There is no longer a Turborepo layer or bundler; Bun runs the scripts across the workspace and `tsc` emits the ESM output.

## Package Publishing - [Changesets](https://github.com/changesets/changesets)
Changesets manages package versioning, changelog generation, and publishing to the package registry. Changesets provides a CLI to simplify bumping packages and adding changelog entries, it then automates versioning and publishing via GitHub Actions.

## Automation - [GitHub Actions](https://github.com/features/actions)
Github Actions is used to automate various tasks including PR checks (linting, type checks, and tests), docs generation, and also releasing packages to NPM.
