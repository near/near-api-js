# Contributing to Near JavaScript API

First off, thanks for taking the time to contribute!

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them.

Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions. 🎉

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [Get Involved](#get-involved)
- [Our Development Process](#our-development-process)
- [Issues](#issues)
  - [New features and enhancements](#new-features-and-enhancements)
  - [Claiming issues](#claiming-issues)
- [Development](#development)
  - [Pull Requests](#pull-requests)
  - [Test Plan](#test-plan)
  - [What Happens Next?](#what-happens-next)

## I Have a Question

If you want to ask a question please use the following resources available for you:

- [Docs site](https://docs.near.org/tools/near-api-js/quick-reference)
- Post a message on our [Discord](https://near.chat/)
- Post a question on [StackOverflow with `[nearprotocol]` tag](https://stackoverflow.com/questions/tagged/nearprotocol)

## Get Involved

There are many ways to contribute to NEAR JavaScript, and many of them do not involve writing any code. Here's a few ideas to get started:

- Simply start using the library. Go through the [user guide](https://docs.near.org/tools/near-api-js/quick-reference). Does everything work as expected? If not, we're always looking for improvements. Let us know by [opening an issue](#issues).
- Look through the [open issues](https://github.com/near/near-api-js/issues). Provide workarounds, ask for clarification, or suggest labels. Help [triage issues](#triaging-issues-and-pull-requests).
- If you find an issue you would like to fix, [open a pull request](#pull-requests). Issues tagged as [_Good first issue_](https://github.com/near/near-api-js/labels/good_first_issue) are a good place to get started.
- Take a look at the [enhancements requested](https://github.com/near/near-api-js/labels/enhancement) by others in the community and consider opening a pull request if you see something you want to work on.

Contributions are very welcome. If you think you need help planning your contribution, please ping us on [Discord](https://near.chat) and let us know you are looking for a bit of help.

### Join our Discord Channel

We have the [`#community-feedback`](https://discord.gg/XKGrd9h9TB) channel on [Discord](https://near.chat) to discuss all things about NEAR development. You can also be of great help by helping other users in the [`#dev-support`](https://discord.gg/Fy4WzwRgun) channel.

### Triaging Issues and Pull Requests

One great way you can contribute to the project without writing any code is to help triage issues and pull requests as they come in.

- Ask for more information if you believe the issue does not provide all the details required to solve it.
- Flag issues that are stale or that should be closed.
- Ask for test plans and review code.

## Our Development Process

Our core team works directly in the public repo.

All pull requests will be checked by the continuous integration system, GitHub actions. There are unit tests, end-to-end tests, performance tests, style tests, and much more.

### Branch Organization

NEAR JavaScript API has one primary branch `master` and we use feature branches with deploy previews to deliver new features with pull requests.

## Issues

When [opening a new issue](https://github.com/near/near-api-js/issues/new/choose), always make sure to fill out the issue template. **This step is very important!** Not doing so may result in your issue not being managed in a timely fashion. Don't take this personally if this happens, and feel free to open a new issue once you've gathered all the information required by the template.

**Please don't use the GitHub issue tracker for questions.** If you have questions about using the library, use any of our [support channels](#I Have a Question), and we will do our best to answer your questions.

### Bugs

We use [GitHub Issues](https://github.com/near/near-api-js/issues) for our public bugs. If you would like to report a problem, take a look around and see if someone already opened an issue about it. If you are certain this is a new, unreported bug, you can submit a [bug report](https://github.com/near/near-api-js/issues/new?assignees=&template=bug.yml).

- **One issue, one bug:** Please report a single bug per issue.
- **Provide reproduction steps:** List all the steps necessary to reproduce the issue. The person reading your bug report should be able to follow these steps to reproduce your issue with minimal effort.

We always recommend filing an issue detailing what you're fixing. This is helpful in case we don't accept that specific fix but want to keep track of the issue.

### Security Bugs

# TBD

### New features and enhancements

If you would like to request a new feature or enhancement but are not yet thinking about opening a pull request, you can file an issue with the [feature template](https://github.com/near/near-api-js/issues/new?template=feature.yml) in the form of an **elaborated RFC**. Alternatively, you can use the [GitHub Discussions](https://github.com/near/near-api-js/discussions/categories/ideas) for more casual feature requests and gain enough traction before proposing an RFC.

### Claiming issues

We have a list of [beginner-friendly issues](https://github.com/near/near-api-js/labels/good_first_issue) to help you get your feet wet in the library codebase and familiar with our contribution process. This is a great place to get started.

Apart from the `good first issue`, the following labels are also worth looking at:

- [`help wanted`](https://github.com/near/near-api-js/labels/help%20wanted): if you have specific knowledge in one domain, working on these issues can make your expertise shine.
- [`status: accepting pr`](https://github.com/near/near-api-js/labels/status%3A%20accepting%20pr): community contributors can feel free to claim any of these.

If you want to work on any of these issues, just drop a message saying "I'd like to work on this", and we will assign the issue to you and update the issue's status as "claimed". **You are expected to send a pull request within seven days** after that, so we can still delegate the issue to someone else if you are unavailable.

Alternatively, when opening an issue, you can also click the "self service" checkbox to indicate that you'd like to work on the issue yourself, which will also make us see the issue as "claimed".

## Development

### Online one-click setup for contributing

You can use Gitpod (a free, online, VS Code-like IDE) for contributing. With a single click, it will launch a workspace and automatically:

- clone the repo.
- install the dependencies.

So that you can start contributing straight away.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/near/near-api-js)


### Installation

1. Ensure you have [Yarn](https://yarnpkg.com/) installed.
2. After cloning the repository, run `yarn install` in the root of the repository. This will install all dependencies as well as build all local packages.
3. To start a development server, run `yarn workspace website start`.

### Code Conventions

# TBD

- **Most important: Look around.** Match the style you see used in the rest of the project. This includes formatting, naming files, naming things in code, naming things in documentation, etc.
- "Attractive"
- We do have Prettier (a formatter) and ESLint (a syntax linter) to catch most stylistic problems. If you are working locally, they should automatically fix some issues during every git commit.
- **For documentation**: Do not wrap lines at 80 characters - configure your editor to soft-wrap when editing documentation.

Don't worry too much about styles in general—the maintainers will help you fix them as they review your code.

## Pull Requests

So you have decided to contribute code back to upstream by opening a pull request. You've invested a good chunk of time, and we appreciate it. We will do our best to work with you and get the PR looked at.

Working on your first Pull Request? You can learn how from this free video series:

[**How to Contribute to an Open Source Project on GitHub**](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Please make sure the following is done when submitting a pull request:

1. **Keep your PR small.** Small pull requests (~300 lines of diff) are much easier to review and more likely to get merged. Make sure the PR does only one thing, otherwise please split it.
2. **Use descriptive titles.** It is recommended to follow this [commit message style](#semantic-commit-messages).
3. **Test your changes.** Describe your [**test plan**](#test-plan) in your pull request description.

All pull requests should be opened against the `master` branch.

We have an integration system that run automated tests to guard against mistakes. The maintainers will also review your code and fix obvious issues for you. These systems' duty is to make you worry as little about the chores as possible. Your code contributions are more important than sticking to any procedures, although completing the checklist will surely save everyone's time.

### Semantic Commit Messages

See how a minor change to your commit message style can make you a better programmer.

Format: `<type>(<scope>): <subject>`

`<scope>` is optional. If your change is specific to one/two packages, consider adding the scope. Scopes should be brief but recognizable, e.g. `content-docs`, `theme-classic`, `core`

The various types of commits:

- `feat`: a new API or behavior **for the end user**.
- `fix`: a bug fix **for the end user**.
- `docs`: a change to the website or other Markdown documents in our repo.
- `refactor`: a change to production code that leads to no behavior difference, e.g. splitting files, renaming internal variables, improving code style...
- `test`: adding missing tests, refactoring tests; no production code change.
- `chore`: upgrading dependencies, releasing new versions... Chores that are **regularly done** for maintenance purposes.
- `misc`: anything else that doesn't change production code, yet is not `test` or `chore`. e.g. updating GitHub actions workflow.

Do not get too stressed about PR titles, however. Your PR will be squash-merged and your commit to the `main` branch will get the title of your PR, so commits within a branch don't need to be semantically named. The maintainers will help you get the PR title right, and we also have a PR label system that doesn't equate with the commit message types. Your code is more important than conventions!

Example:

```
feat(core): allow overriding of config
^--^^----^  ^------------^
|   |       |
|   |       +-> Summary in present tense. Use lower case not title case!
|   |
|   +-> The package(s) that this change affected.
|
+-------> Type: see below for the list we use.
```

### Versioned Docs

# TBD

### Test Plan

A good test plan has the exact commands you ran and their output. If you've changed APIs, update the documentation.

Tests are integrated into our continuous integration system, so you don't always need to run local tests. However, for significant code changes, it's saves both your and the maintainers' time if you can do exhaustive tests locally first to make sure your PR is in good shape. There are many types of tests:

- **Build and typecheck.** We use TypeScript in our codebase, which can make sure your code is consistent and catches some obvious mistakes early.
- **Unit tests.** We use [Jest](https://jestjs.io/) for unit tests of API endpoints' behavior. You can run `yarn test` in the root directory to run all tests, or `yarn test path/to/your/file.test.ts` to run a specific test.

### What Happens Next?

The core team will be monitoring pull requests. Do help us by keeping pull requests consistent by following the guidelines above.
