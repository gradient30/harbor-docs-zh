# Quick start {#quick-start}

> Run your first job.

## Install Harbor {#install-harbor}

Follow our [installation instructions](/docs/getting-started/installation) to install Harbor, which involves installing the package and its dependencies.

## Run a job {#run-a-job}

In Harbor, a trial is an agent's attempt to solve a task. A job is a collection of trials.

To run your first job, run

```bash
OPENAI_API_KEY="<your-key>" \
harbor run -t hello-world/hello-world \
  -a codex -m openai/gpt-5.6-luna
```

By default, the agent will run in a [Docker](https://www.docker.com/) sandbox.

Use the `--env/-e` flag to configure it to run in a cloud sandbox like [Modal](https://modal.com/products/sandboxes) or [Daytona](https://www.daytona.io/).

Add the `--launch` flag to run the job on Harbor Hub.

See [Run a job](/docs/core-concepts/jobs/run-a-job) for more information.

## View the results {#view-the-results}

Harbor ships with a local web viewer for inspecting results.

```bash
harbor view ./jobs
```

See [View job results](/docs/core-concepts/results/view-job-results) for more information.

## Share results {#share-results}

You can upload your results to Harbor Hub to share with others. Those you share with can the job's configuration and reproduce the results.

```bash
harbor upload "./jobs/<job-id>"
```

See the [Terminal-Bench website](https://www.tbench.ai/) for an example of how publishing results enables full auditability.

## Other resources {#other-resources}

  - **[Task overview](/docs/core-concepts/tasks/overview)** — Learn what a Harbor task is.

  - **[Create a task](/docs/tutorials/create-a-task)** — Build your first Harbor task.
