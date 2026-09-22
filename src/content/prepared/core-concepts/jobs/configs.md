# Configs {#configs}

> Complete schema for configuring Harbor jobs.

```bash
harbor run -c "<config.yaml>"
```

Job config files provide the same controls as `harbor run` flags while supporting multiple agents, datasets, and tasks in one reusable JSON or YAML file.

Example:

```yaml
job_name: my-first-job
tasks:
  - path: "<task-path>"
agents:
  - name: codex
    model_name: openai/gpt-6-astra
environment:
  type: docker
```

## Creating a config {#creating-a-config}

You can use

```bash
harbor job init
```

to generate a config. It accepts the same flags as `harbor run`.

To generate a config with all available fields:

```bash
harbor job init "<config.yaml>" --full
```

Use `--print-config` to inspect the resolved config without running the job:

```bash
harbor run --config "<config.yaml>" --print-config
```

Use `harbor job schema` to print the config JSON Schema:

```bash
harbor job schema
```

Use `--dry-run` to check the config, agent kwargs, credentials, and task sources without downloading tasks or running the job:

```bash
harbor run --dry-run --config "<config.yaml>"
```

Add `--launch` to use Harbor Hub schemas and validation.

> **说明** All top-level fields are optional. Harbor applies the defaults shown below. Fields marked as required are required only when their containing object is present.

## Job {#job}

- `job_name` (`string`) 默认 `current timestamp` — Job name. When omitted, Harbor uses the current time in `YYYY-MM-DD__HH-MM-SS` format.

- `jobs_dir` (`string`) — Directory where Harbor stores job results.

- `n_attempts` (`integer`) 默认 `1` — Number of attempts for every task and agent combination.

- `install_only` (`boolean`) 默认 `false` — Run agent setup only, skipping the agent phase and disabling verification.

- `timeout_multiplier` (`number`) 默认 `1.0` — Multiplier applied to task timeouts unless a phase-specific multiplier overrides it.

- `agent_timeout_multiplier` (`number | null`) 默认 `null` — Multiplier applied to the agent execution timeout.

- `verifier_timeout_multiplier` (`number | null`) 默认 `null` — Multiplier applied to the verifier timeout.

- `agent_setup_timeout_multiplier` (`number | null`) 默认 `null` — Multiplier applied to the agent setup timeout.

- `environment_build_timeout_multiplier` (`number | null`) 默认 `null` — Multiplier applied to the environment build timeout.

- `debug` (`boolean`) 默认 `false` — Enable debug logging.

- `n_concurrent_trials` (`integer`) 默认 `4` — Maximum number of concurrent trials. Must be at least 1. Per-agent concurrency limits cannot exceed this value.

- `quiet` (`boolean`) 默认 `false` — Suppress individual trial progress displays.

- `retry` (`RetryConfig`) — Retry and exponential-backoff configuration.

- `environment` (`EnvironmentConfig`) — Shared environment-provider configuration applied to every trial.

- `verifier` (`VerifierConfig`) — Shared verifier configuration applied to every trial.

- `metrics` (`list[MetricConfig]`) 默认 `[]` — Job-level metrics appended to each dataset's metrics.

- `agents` (`list[AgentConfig]`) — Agents evaluated by the job.

- `user_agent` (`UserAgentConfig | null`) 默认 `null` — Optional simulated-user agent and bridge applied to every trial.

- `datasets` (`list[DatasetConfig]`) 默认 `[]` — Dataset sources expanded into tasks.

- `tasks` (`list[TaskConfig]`) 默认 `[]` — Individual task sources.

- `artifacts` (`list[string | ArtifactConfig]`) 默认 `[]` — Environment paths collected after each trial. A string is shorthand for an artifact with only `source` set.

- `extra_instruction_paths` (`list[string]`) 默认 `[]` — Files appended to each task instruction, before `extra_instructions`.

- `extra_instructions` (`list[string]`) 默认 `[]` — Inline text appended to each task instruction after `extra_instruction_paths`.

- `source_jobs` (`list[SourceJobConfig]`) 默认 `[]` — Source jobs used for regrading. When set, Harbor derives one new trial from each matching source trial instead of expanding tasks, agents, and attempts normally.

## Retry {#retry}

- `retry.max_retries` (`integer`) 默认 `0` — Maximum retry attempts. Must be at least 0.

- `retry.include_exceptions` (`set[string] | null`) 默认 `null` — Exception class names eligible for retries. `null` includes every exception not excluded below.

- `retry.exclude_exceptions` (`set[string] | null`) 默认 `built-in non-retryable exceptions` — Exception class names that are never retried. Exclusions take precedence over inclusions. The defaults are `AgentTimeoutError`, `VerifierTimeoutError`, `RewardFileNotFoundError`, `RewardFileEmptyError`, `VerifierOutputParseError`, `ApiUsageLimitError`, `AgentSafetyRefusalError`, `AgentAuthenticationError`, and `ModelNotFoundError`.

- `retry.wait_multiplier` (`number`) 默认 `1.0` — Multiplier for exponential-backoff wait times.

- `retry.min_wait_sec` (`number`) 默认 `1.0` — Minimum delay between retries in seconds.

- `retry.max_wait_sec` (`number`) 默认 `60.0` — Maximum delay between retries in seconds.

## Agents {#agents}

- `agents[].name` (`string | null`) — Pre-integrated agent name. Use `import_path` for a custom agent.

- `agents[].import_path` (`string | null`) 默认 `null` — Custom agent import path in `module.path:ClassName` format.

- `agents[].model_name` (`string | null`) 默认 `null` — Model identifier passed to the agent.

- `agents[].n_concurrent` (`integer | null`) 默认 `null` — Per-agent limit on concurrent `agent.run()` phases. Must be at least 1 and cannot exceed `n_concurrent_trials`.

- `agents[].concurrency_group` (`string | null`) 默认 `null` — Shared concurrency-pool name. Agents in the same group must set the same `n_concurrent` value.

- `agents[].skills` (`list[string]`) 默认 `[]` — Local skill directories, Git URLs, or `org/name[@ref]` skill sources.

- `agents[].override_timeout_sec` (`number | null`) 默认 `null` — Replace the task's agent timeout with this value in seconds.

- `agents[].override_setup_timeout_sec` (`number | null`) 默认 `null` — Replace the agent setup timeout with this value in seconds.

- `agents[].max_timeout_sec` (`number | null`) 默认 `null` — Upper bound for the effective agent timeout in seconds.

- `agents[].resume_trajectory` (`boolean`) 默认 `false` — Resume the agent's native session between steps of a multi-step task. Requires agent resume support.

- `agents[].load_trajectory` (`string | null`) 默认 `null` — Load a native `.jsonl` or ATIF `.json` trajectory before the first step. Requires the corresponding agent capability.

- `agents[].extra_allowed_hosts` (`list[string]`) 默认 `[]` — Hostnames, IP addresses, or CIDR ranges added to the allowlist during `agent.run()` only.

- `agents[].include_logs` (`list[string]`) 默认 `[]` — Glob patterns selecting agent log files to download.

- `agents[].exclude_logs` (`list[string]`) 默认 `[]` — Glob patterns excluded from downloaded agent logs after applying `include_logs`.

- `agents[].kwargs` (`object`) — Integration-specific keyword arguments passed to the agent constructor.

- `agents[].env` (`object[string, string]`) — Environment variables exposed only during the agent phase.

- `agents[].mcp_servers` (`list[MCPServerConfig]`) 默认 `[]` — MCP servers made available to the agent.

See [Pre-integrated agents](/docs/core-concepts/agents/pre-integrated-agents), [Custom agents](/docs/core-concepts/agents/custom-agents), [Skills](/docs/core-concepts/jobs/skills), and [Loading trajectories](/docs/core-concepts/jobs/loading-trajectories).

### MCP servers {#mcp-servers}

- `agents[].mcp_servers[].name` (`string`) — Required server name.

- `agents[].mcp_servers[].transport` — MCP transport. The legacy value `http` is normalized to `streamable-http`.

- `agents[].mcp_servers[].url` (`string | null`) 默认 `null` — Server URL. Required for `sse` and `streamable-http` transports.

- `agents[].mcp_servers[].command` (`string | null`) 默认 `null` — Executable command. Required for the `stdio` transport.

- `agents[].mcp_servers[].args` (`list[string]`) 默认 `[]` — Arguments passed to a `stdio` server command.

## Simulated user {#simulated-user}

`user_agent` supports every field in `agents[]`, plus the fields below. The `bridge` field is required when `user_agent` is configured.

- `user_agent.user_persona_path` (`string | null`) 默认 `null` — Path to a file defining the simulated user's persona.

- `user_agent.user_prompt_template_path` (`string | null`) 默认 `null` — Path to the Jinja2 prompt template used by the simulated user.

- `user_agent.bridge` (`BridgeConfig`) — Required bridge connecting the simulated user to the primary agent.

- `user_agent.bridge.kind` — Required bridge implementation. Currently only `acp` is supported.

- `user_agent.bridge.prompt_path` (`string | null`) 默认 `null` — Optional replacement for the bridge instructions.

- `user_agent.bridge.kwargs` (`object`) — Bridge-specific keyword arguments.

See [Simulate a user](/docs/core-concepts/jobs/simulate-a-user).

## Environment {#environment}

- `environment.type` (`EnvironmentType | null`) — Pre-integrated environment provider: `docker`, `podman`, `daytona`, `e2b`, `modal`, `runloop`, `langsmith`, `ec2`, `gke`, `ack`, `openshift`, `novita`, `apple-container`, `singularity`, `islo`, `tensorlake`, `cwsandbox`, `use-computer`, `cua-cloud`, `blaxel`, `opensandbox`, `beam`, `skypilot`, `hf-sandbox`, `hyperbrowser`, or `vercel`. See [Pre-integrated sandboxes](/docs/core-concepts/sandboxes/pre-integrated-sandboxes).

- `environment.import_path` (`string | null`) 默认 `null` — Custom environment import path in `module.path:ClassName` format.

- `environment.force_build` (`boolean`) 默认 `false` — Rebuild the environment even when a cached build exists.

- `environment.delete` (`boolean`) 默认 `true` — Delete the environment after the trial finishes.

- `environment.cpu_enforcement_policy` — How the provider enforces the task's CPU value.

- `environment.memory_enforcement_policy` — How the provider enforces the task's memory value.

- `environment.override_cpus` (`integer | null`) 默认 `null` — Replace the task's CPU value at runtime.

- `environment.override_memory_mb` (`integer | null`) 默认 `null` — Replace the task's memory value in MB.

- `environment.override_storage_mb` (`integer | null`) 默认 `null` — Replace the task's storage value in MB.

- `environment.override_gpus` (`integer | null`) 默认 `null` — Replace the task's GPU count.

- `environment.override_tpu` (`TpuSpec | null`) 默认 `null` — Replace the task's TPU specification.

- `environment.suppress_override_warnings` (`boolean`) 默认 `false` — Deprecated. This field is accepted but has no effect and is excluded when serializing configs.

- `environment.mounts` (`list[ServiceVolumeConfig] | null`) 默认 `null` — Docker Compose long-syntax volume mounts for the agent environment only.

- `environment.extra_docker_compose` (`list[string]`) 默认 `[]` — Additional Docker Compose overlay files for the agent environment only.

- `environment.env` (`object[string, string]`) — Baseline environment variables exposed inside the sandbox.

- `environment.kwargs` (`object`) — Provider-specific keyword arguments passed to the environment constructor.

- `environment.extra_allowed_hosts` (`list[string]`) 默认 `[]` — Hostnames, IP addresses, or CIDR ranges added to the environment network baseline.

See [Resources](/docs/core-concepts/tasks/resources), [Network policies](/docs/core-concepts/tasks/network-policies), and [Custom sandboxes](/docs/core-concepts/sandboxes/custom-sandboxes).

### TPU override {#tpu-override}

- `environment.override_tpu.type` (`string`) — Required TPU alias or canonical GKE accelerator label, such as `v6e` or `tpu-v6e-slice`.

- `environment.override_tpu.topology` (`string`) — Required topology in `NxM` or `NxMxK` format, such as `2x4`.

### Mounts {#mounts}

- `environment.mounts[].type` — Required mount type.

- `environment.mounts[].source` (`string`) — Required host path, named volume, or image source.

- `environment.mounts[].target` (`string`) — Required target path inside the container.

- `environment.mounts[].read_only` (`true`) 默认 `omitted` — Set to `true` for a read-only mount.

- `environment.mounts[].bind.create_host_path` (`false`) 默认 `omitted` — Set to `false` to prevent Docker Compose from creating a missing bind source path.

- `environment.mounts[].bind.selinux` 默认 `omitted` — Optional SELinux relabeling mode for a bind mount.

- `environment.mounts[].volume.subpath` (`string`) 默认 `omitted` — Optional subpath within a named volume.

- `environment.mounts[].image.subpath` (`string`) 默认 `omitted` — Optional subpath within an image mount.

## Verifier {#verifier}

- `verifier.override_timeout_sec` (`number | null`) 默认 `null` — Replace the task's verifier timeout with this value in seconds.

- `verifier.max_timeout_sec` (`number | null`) 默认 `null` — Upper bound for the effective verifier timeout in seconds.

- `verifier.include_logs` (`list[string]`) 默认 `[]` — Glob patterns selecting verifier log files to download. The reward file is always downloaded.

- `verifier.exclude_logs` (`list[string]`) 默认 `[]` — Glob patterns excluded from verifier logs after applying `include_logs`.

- `verifier.env` (`object[string, string]`) — Environment variables exposed only during the verifier phase.

- `verifier.import_path` (`string | null`) 默认 `null` — Custom verifier import path in `module.path:ClassName` format.

- `verifier.kwargs` (`object`) — Keyword arguments passed to the custom verifier.

- `verifier.disable` (`boolean`) 默认 `false` — Skip verification. Automatically set to `true` when `install_only` is enabled.

See [Custom verifiers](/docs/core-concepts/jobs/custom-verifiers) and [Environment variables](/docs/core-concepts/jobs/environment-variables).

## Datasets {#datasets}

- `datasets[].path` (`string | null`) 默认 `null` — Local dataset directory. With `repo`, this selects a repo-relative implicit dataset directory.

- `datasets[].name` (`string | null`) 默认 `null` — Harbor Hub dataset in `org/name` format, or a bare dataset name for a custom or Git-repository registry.

- `datasets[].version` (`string | null`) 默认 `null` — Version selected from a JSON registry or a named Git-repository registry.

- `datasets[].ref` (`string | null`) 默认 `null` — Tag, revision, or digest selected for a Harbor Hub dataset.

- `datasets[].registry_url` (`string | null`) 默认 `null` — URL of a custom `registry.json` file.

- `datasets[].registry_path` (`string | null`) 默认 `null` — Path to a custom `registry.json`. With `repo`, this path is relative to the repository.

- `datasets[].repo` (`string | null`) 默认 `null` — Git repository shorthand or URL, optionally pinned with `@ref`.

- `datasets[].overwrite` (`boolean`) 默认 `false` — Overwrite cached remote tasks.

- `datasets[].download_dir` (`string | null`) 默认 `null` — Directory used to cache downloaded tasks.

- `datasets[].task_names` (`list[string] | null`) 默认 `null` — Glob patterns selecting tasks by name.

- `datasets[].exclude_task_names` (`list[string] | null`) 默认 `null` — Glob patterns excluding tasks after applying `task_names`.

- `datasets[].n_tasks` (`integer | null`) 默认 `null` — Maximum number of tasks after inclusion and exclusion filters are applied.

Each dataset must select exactly one source shape. Without `repo`, set either `path` or `name`, but not both. With `repo`, `path` selects an implicit dataset while `name` selects a named registry dataset. `version` and `ref` cannot both be set.

See [Datasets](/docs/core-concepts/datasets/datasets), [Registries](/docs/core-concepts/datasets/registries), and [Git repos](/docs/core-concepts/datasets/git-repos).

## Tasks {#tasks}

- `tasks[].path` (`string | null`) 默认 `null` — Local task directory, or the path within a Git repository when `git_url` is set.

- `tasks[].git_url` (`string | null`) 默认 `null` — Git repository containing the task.

- `tasks[].git_commit_id` (`string | null`) 默认 `null` — Git commit containing the task. Requires `git_url`.

- `tasks[].name` (`string | null`) 默认 `null` — Harbor Hub task name in `org/name` format.

- `tasks[].ref` (`string | null`) 默认 `null` — Harbor Hub task tag, revision, or digest. Requires `name`.

- `tasks[].overwrite` (`boolean`) 默认 `false` — Overwrite the cached remote task.

- `tasks[].download_dir` (`string | null`) 默认 `null` — Directory used to cache the downloaded task.

- `tasks[].source` (`string | null`) 默认 `null` — Optional source label used when grouping tasks and metrics.

Every task must set either `path` or `name`, but not both. A Git task uses `path` with `git_url`; a Harbor Hub task uses `name` with an optional `ref`.

See [Tasks → Overview](/docs/core-concepts/tasks/overview).

## Metrics {#metrics}

- `metrics[].type` — Metric implementation used to aggregate task rewards.

- `metrics[].kwargs` (`object`) — Keyword arguments passed to the metric implementation. `uv-script` requires `script_path`.

See [Metrics](/docs/core-concepts/datasets/metrics).

## Artifacts {#artifacts}

- `artifacts[].source` (`string`) — Required environment path to collect. It cannot contain `..` path components.

- `artifacts[].destination` (`string | null`) 默认 `null` — Optional path under the trial's artifact directory. Harbor derives it from `source` when omitted.

- `artifacts[].exclude` (`list[string]`) 默认 `[]` — Patterns excluded when downloading a directory artifact.

- `artifacts[].service` (`string | null`) 默认 `null` — Docker Compose service to collect from. `null` and `main` target the agent container.

See [Artifact collection](/docs/core-concepts/jobs/artifact-collection).

## Regrade sources {#regrade-sources}

- `source_jobs[].action` — Required derivation action. Currently only `regrade` is supported.

- `source_jobs[].type` — Required source location.

- `source_jobs[].job_id` (`string | null`) 默认 `null` — Source job UUID. Required for a Hub source and optional for a local source.

- `source_jobs[].path` (`string | null`) 默认 `null` — Source job directory. Required for a local source and invalid for a Hub source.

Regrading cannot be combined with `install_only`. See [Regrade](/docs/core-concepts/jobs/regrade).
