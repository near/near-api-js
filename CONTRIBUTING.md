# Contributing to Near JavaScript API

First off, thanks for taking the time to contribute! We look forward to your contributions. 🎉

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project handles them.

We take community contributions very seriously, as we understand you invest precious time and effort. That is why we have this guide to set mutual expectations, to avoid unfortunate situation where we can't accept a contribution because it may not fit project's goals, or lacks needed quality standards. There is one important rule to follow - please let us know ahead about what you plan to do, and get an OK from our team so that we can prepare for accepting your contribution.

> And if you like the project, but just don't have time to contribute, that's fine. There are other easy ways to support the project and show your appreciation, which we would also be very happy about:
> - Star the project
> - Tweet about it
> - Refer this project in your project's readme
> - Mention the project at local meetups and tell your friends/colleagues

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [Get Involved](#get-involved)
- [Our Development Process](#our-development-process)
- [Development](#development)
  - [Pull Requests](#pull-requests)
  - [Tests](#tests)
  - [Versioned Docs](#versioned-docs)
  - [What Happens Next?](#what-happens-next)

## I Have a Question

If you want to ask a question please use the following resources available for you:

- [Docs site](https://docs.near.org/tools/near-api-js/quick-reference)
- Post a message on our [Discord](https://near.chat/)
- Post a question on [StackOverflow with `[nearprotocol]` tag](https://stackoverflow.com/questions/tagged/nearprotocol)
- Post a question on [GitHub Discussions](https://github.com/near/near-api-js/discussions)

## Get Involved

There are many ways to contribute to this project, and many of them do not involve writing any code. Here's a few ideas to get started:

- Simply start using the library. Go through the [user guide](https://docs.near.org/tools/near-api). Does everything work as expected? If not, we're always looking for improvements.
- Look through the [open issues](https://github.com/near/near-api-js/issues). Provide workarounds or ask for clarification.
- If you find an issue you would like to fix, [open a pull request](#pull-requests). Issues tagged as [_Good first issue_](https://github.com/near/near-api-js/labels/good_first_issue) are a good place to get started.
- Take a look at the [enhancements requested](https://github.com/near/near-api-js/labels/enhancement) by others in the community and consider opening a pull request if you see something you want to work on.

If you think you need help planning your contribution, please ping us on [Discord](https://near.chat) and let us know you are looking for a bit of help.

### Join our Discord Channel

We have the [`#dev-feedback`](https://discord.gg/XKGrd9h9TB) channel on [Discord](https://near.chat) to discuss all things about NEAR development. You can also be of great help by helping other users in the [`#dev-support`](https://discord.gg/Fy4WzwRgun) channel.

### Triaging Issues and Pull Requests

One great way you can contribute to the project without writing any code is to help triage issues and pull requests as they come in.

You can review code, or ask for more information if you believe the issue does not provide all the details required to solve it.

## Our Development Process

Our core team works directly in the public repo, and pull requests are checked by the continuous integration system, GitHub actions. There are unit tests and end-to-end tests.

**Branch organization**: This project has one primary branch `master` and we use feature branches with deploy previews to deliver new features with pull requests.

**Issue templates**: When [opening a new issue](https://github.com/near/near-api-js/issues/new/choose), always **make sure to fill out the issue template**. The issue template is very important, as it sets mutual expectations about what you plan to do, and help us prepare to accept your contribution.

**Bugs**: If you would like to report a problem use the [bug report](https://github.com/near/near-api-js/issues/new?assignees=&template=bug.yml) issue template.

**Security Bugs**: To report security issues in this project please send an email to [security@near.org](mailto:security@near.org)

**New features and enhancements**:

If you have a casual feature request or proposal, you can raise it in our [GitHub Discussions](https://github.com/near/near-api-js/discussions/categories/ideas).

If you'd like to work on a PR with an implementation of your proposal, please file an issue with the [feature template](https://github.com/near/near-api-js/issues/new?template=feature.yml) in the form of an **elaborated RFC**. Please wait for our team to respond with an approval before you start working on it, as we can only accept PRs that are aligned with project's goals and roadmap, so we really want to avoid situations where we reject something you worked hard on. (BTW, if you think that project's goals or roadmap should change in some way, do feel free to raise it in [GitHub Discussions](https://github.com/near/near-api-js/discussions/) :)  and we'll talk about it). 

### Claiming issues
 
We have a list of [beginner-friendly issues](https://github.com/near/near-api-js/labels/good_first_issue) to help you get you get started with the codebase and familiar with our contribution process. This is a great place to start.

Apart from the `good first issue`, the following labels are also worth looking at:

- [`help wanted`](https://github.com/near/near-api-js/labels/help%20wanted): if you have specific knowledge in one domain, working on these issues can make your expertise shine.
- [`accepting pr`](https://github.com/near/near-api-js/labels/status%3A%20accepting%20pr): community contributors can feel free to claim any of these.

If you want to work on any of these issues, just drop a message saying "I'd like to work on this", and we will assign the issue to you and update the issue's status as "claimed". **You are expected to send a pull request within seven days** after that, so we can still delegate the issue to someone else if you are unavailable.

## Development

### Online one-click setup for contributing

You can use Gitpod (a free, online, VS Code-like IDE) for contributing. With a single click, it will launch a workspace and automatically:

- clone the repo.
- install the dependencies.

So that you can start contributing straight away.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/near/near-api-js)

## Pull Requests

We appreciate the time and effort you invested! 🙏 We will do our best to work with you and get the PR looked at.

> Working on your first-ever Pull Request? You can learn how from this free video series:
> [**How to Contribute to an Open Source Project on GitHub**](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Please make sure the following is done when submitting a pull request:

1. **Keep your PR small.** Small pull requests (~300 lines of diff) are much easier to review and more likely to get merged. Make sure the PR does only one thing, otherwise please split it.
2. **Use descriptive titles.** It is recommended to follow semantic commit conventions: https://www.conventionalcommits.org/en/v1.0.0/
3. **Test your changes.** Include unit tests for any public API you touch.

All pull requests should be opened against the `master` branch.

### Versioned TypeDocs

Each time we publish a version of the package we also publish a version of the [TypeDocs](https://docs.near.org/tools/near-api-js/reference).

- If you touch the public API please make sure the TypeDocs reflect your changes well.
- If you just want to fix the TypeDocs for current version, let us know in the PR, and we'll publish your fix onto the current TypeDocs.
- For past versions of the library - we accept TypeDocs fixes only if they are significant (for example security-related warnings and edge-cases, or things that are fundamentally wrong).

### Tests

Please include unit tests for any public api you add or touch. We use [Jest](https://jestjs.io/) for tests.

### What Happens Next?

Our team will be monitoring pull requests. Do help us by keeping pull requests consistent by following the guidelines above.
