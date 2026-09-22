# Changelog {#changelog}

> Release notes and product updates for Harbor.

## v0.23.0 September 12, 2026 {#v0-23-0-september-12-2026}

* **Agent options:** Discover supported settings with `harbor agent schema <name>`.
    Built-in agents validate options before starting a sandbox.
  * **Job configuration:** Compose config files and validate runs with
    `harbor run --dry-run` before downloading tasks or starting environments.
  * **New integrations:** Added Muse Code, Strands, and the FX dev-channel agent,
    plus Podman, Runta, and Kata sandboxes.
  * **Trajectories:** ATIF v1.8 supports audio content. Agent results now record
    token usage by model.
  * **RewardKit:** Judges can receive trajectory images and audio. Added FX agent
    judges and signed weighted aggregation.
  * **Multi-step tasks:** Added Hermes session resume and regrading for completed
    multi-step trials.
  * **Hosted workflows:** Added Hub job renaming, ownership transfer, and agent
    catalog discovery.

## v0.22.0 August 22, 2026 {#v0-22-0-august-22-2026}

* **Simulated users:** Run multi-turn evaluations in which a user agent and a
    primary agent communicate through ACP.
  * **Trajectory loading:** Tasks can provide prior ATIF context through
    `trajectory.json` before the agent's first turn.
  * **New agents:** Added MCode, Junie, and FX integrations.
  * **New sandboxes:** Added Hyperbrowser and Vercel Sandbox integrations.
  * **Hosted workflows:** Added hosted custom agents, resumable trial uploads,
    and task and dataset sharing commands.
  * **RewardKit:** Added nested dimension groups and simplified agent judges.

## v0.21.0 August 10, 2026 {#v0-21-0-august-10-2026}

* **Trial handoff:** Resume a completed Claude Code session locally to ask the
    agent about its run.
  * **Regrading:** Use `harbor job regrade` or `harbor trial regrade` to run a
    new verifier against recorded trials without rerunning the agent.
  * **Trajectory loading:** Claude Code and Codex can load native or ATIF
    trajectories at run time.
  * **Package versioning:** Task and dataset packages now record versions and
    warn when a selected version has been yanked.
  * **New agents:** Added Cortex Code, Kimi Code, and Google Antigravity.
  * **New sandbox:** Added Hugging Face Sandbox.

  > **注意** **Breaking security change:** GKE sandboxes no longer mount Kubernetes
>     service-account credentials. Workloads that need cluster access must provide
>     credentials explicitly.

> **说明** This changelog highlights user-facing stable releases and is not an exhaustive
>   commit history. See the [repository changelog](https://github.com/harbor-framework/harbor/blob/main/CHANGELOG.md),
>   [GitHub releases](https://github.com/harbor-framework/harbor/releases), or
>   [PyPI history](https://pypi.org/project/harbor/#history) for earlier releases.
