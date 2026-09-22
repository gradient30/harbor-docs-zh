# Hosted Harbor {#hosted-harbor}

> Launching Jobs On The Hub

The [Harbor Hub](https://hub.harborframework.com) can now be used to run remote harbor rollouts.
This guide provides instructions for launching remote jobs through the CLI, web UI, and API.

First, visit [the job launcher](https://hub.harborframework.com/jobs/launch).
Click the link in the banner to fill out a google form for access to remote rollouts.

Then follow the [API key creation guide](/docs/core-concepts/hosted-harbor/api-key) to create an API key.

## Interfaces {#interfaces}

| Page                                             | Use it for                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------- |
| [Web UI](/docs/core-concepts/hosted-harbor/web-ui)    | Adding secrets and launching a job from the browser                 |
| [CLI](/docs/core-concepts/hosted-harbor/cli)          | Launching with `harbor run --launch`, then browsing jobs and trials |
| [API overview](/docs/core-concepts/hosted-harbor/api) | Base URL, authentication, and error shapes                          |

## API Reference {#api-reference}

| Page                                                                      | Endpoints                                     |
| ------------------------------------------------------------------------- | --------------------------------------------- |
| [Submitting jobs](/docs/core-concepts/hosted-harbor/submitting-jobs)           | `POST /job-submit`, `GET /job-status`         |
| [Custom agents](/docs/core-concepts/hosted-harbor/custom-agents)               | Running an ACP agent from a GitHub repository |
| [Managing secrets](/docs/core-concepts/hosted-harbor/secrets)                  | `/secrets`, `/secrets/preflight`              |
| [Registry credentials](/docs/core-concepts/hosted-harbor/registry-credentials) | `/registry-credentials`                       |
| [Leaderboards](/docs/core-concepts/harbor-hub/leaderboards)                    | Curated leaderboards from the CLI             |
