# Run a job {#run-a-job}

> Run a job in Harbor.

A job is a collection of trials. A trial is an agent's attempt at completing a task. To run a job in Harbor, use the `harbor run` command.

**Local dataset**

```bash
    harbor run -p "<path/to/dataset>" -a "<agent>" -m "<model>"
    ```

**Local task**

```bash
    harbor run -p "<path/to/task>" -a "<agent>" -m "<model>"
    ```

**Hub dataset**

```bash
    harbor run -d "<org/dataset>@<ref>" -a "<agent>" -m "<model>"
    ```

**Hub task**

```bash
    harbor run -t "<org/task>@<ref>" -a "<agent>" -m "<model>"
    ```

**Custom registry**

```bash
    harbor run -d "<dataset>@<version>" \
      --registry-path "<path/to/registry.json>" \
      -a "<agent>" -m "<model>"
    ```

    ```bash
    harbor run -d "<dataset>@<version>" \
      --registry-url "<url/to/registry.json>" \
      -a "<agent>" -m "<model>"
    ```

    See [Registries](/docs/core-concepts/datasets/registries).

**Git repository**

```bash
    harbor run --repo "<org/repo-name>" -p "<path/to/tasks>" \
      -a "<agent>" -m "<model>"
    ```

    See [Git repos](/docs/core-concepts/datasets/git-repos).

## Configuring a job {#configuring-a-job}

Harbor exposes CLI flags for configuring jobs.

**Output**

```bash
    harbor run -p "<path>" -a "<agent>" -m "<model>" \
      -o "<jobs-dir>" --job-name "<job-name>"
    ```

**Concurrency and retries**

```bash
    harbor run -p "<path>" -a "<agent>" -m "<model>" \
      -n "<concurrent>" -k "<attempts>" -r "<retries>"
    ```

**Task filters**

```bash
    harbor run -p "<path>" -a "<agent>" -m "<model>" \
      -l "<max-tasks>" -i "<some-*-glob-pattern>" -x "<some-name>"
    ```

**Sandbox**

```bash
    harbor run -p "<path>" -a "<agent>" -m "<model>" \
      -e "<sandbox>" --allow-agent-host "<host>" --override-memory-mb "<memory-mb>"
    ```

    See [Pre-integrated sandboxes](/docs/core-concepts/sandboxes/pre-integrated-sandboxes), [Resources](/docs/core-concepts/tasks/resources), and [Network policies](/docs/core-concepts/tasks/network-policies).

**Simulated user**

```bash
    harbor run -p "<path>" -a "<agent>" -m "<model>" \
      --user-agent "<user-agent>" --user-model "<user-model>"
    ```

    See [Simulate a user](/docs/core-concepts/jobs/simulate-a-user).

Run `harbor run --help` to see all available flags.

## Agents {#agents}

Harbor has pre-integrated agents and support for custom agents.

Run `harbor run --help` to see the available agents.

You can configure agents using the `--ak` flag. You can also configure the model using the `--model/-m` flag.

```bash
harbor run -a "<agent>" -m "<model>" --ak reasoning_effort=high
```

See [Pre-integrated agents](/docs/core-concepts/agents/pre-integrated-agents) or [Custom agents](/docs/core-concepts/agents/custom-agents) to learn more.

## Config files {#config-files}

Under the hood, configuring a job with CLI flags builds a `JobConfig` object and passes it to the runner.

You can see the config when you run `harbor run` with the `--print-config` flag, or by inspecting the `<job/path>/config.json` file after you run `harbor run`. You can also use `harbor job init` to create and save a config instead of running the job.

For frequent setups, we recommend creating and version controlling your configs.

> **说明** You can pair a config with CLI flags to override values in the original config.

An example config is shown below.

```json
{
  "n_attempts": 5,
  "n_concurrent_trials": 100,
  "retry": {
    "max_retries": 3
  },
  "agents": [
    {
      "name": "<agent>",
      "model_name": "<model>"
    }
  ],
  "datasets": [
    {
      "path": "<path>"
    }
  ]
}
```

See [Configs](/docs/core-concepts/jobs/configs) for the complete job config schema.

## Run on Harbor Hub {#run-on-harbor-hub}

You can run your jobs on Harbor Hub by including the `--launch` flag.

Harbor Hub

* Orchestrates your trials in the cloud
* Enforces per-provider concurrency limits
* Pauses on cascading failures (e.g. usage limits)
* Backs off on rate limits
* Can be accessed using the UI or CLI to debug, trigger retries, share results, or monitor progress

First, sign in.

```bash
harbor auth login
```

Then, run your job with the `--launch` flag.

```bash
harbor run -d "<org/name>" -a "<agent>" -m "<model>" \
  -n "<concurrent>" --one-off-secret "<name>=<value>" --launch
```

See [Hosted jobs](/docs/core-concepts/harbor-hub/hosted-jobs) for more information about evaluating custom agents and Git-based tasks and datasets.
