# Git repos {#git-repos}

> Run a dataset from a Git repo.

Harbor can resolve datasets directly from Git repositories using the `--repo` flag. This lets you run benchmarks hosted in any GitHub, GitLab, or Hugging Face repo.

## Quick start {#quick-start}

```bash
harbor run --repo "<org/repo-name>" -a "<agent>" -m "<model>"
```

This clones the repository, and by default runs that tasks in the `tasks/` directory.

## Specifying the repository {#specifying-the-repository}

The `--repo` flag accepts several formats:

```bash
# GitHub shorthand (defaults to github.com) {#github-shorthand-defaults-to-github-com}
--repo "<org/repo-name>"

# Pinned to a branch, tag, or commit {#pinned-to-a-branch-tag-or-commit}
--repo "<org/repo-name>@<tag>"
--repo "<org/repo-name>@<branch>"
--repo "<org/repo-name>@<commit>"

# Full URL {#full-url}
--repo "https://github.com/<org/repo-name>"

# Subdirectory via /tree/ path {#subdirectory-via-tree-path}
--repo "https://github.com/<org/repo-name>/tree/<ref>/<subdirectory>"

# Hugging Face {#hugging-face}
--repo "https://huggingface.co/datasets/<org/repo-name>"

# GitLab {#gitlab}
--repo "https://gitlab.com/<org/repo-name>"
```

When no `@ref` is specified, the repository's default branch is used.

## Selecting a dataset {#selecting-a-dataset}

You can select datasets using `-p` to specify a path within the repo or `-d` to specify a dataset defined in a root-level `registry.json` file (or as specified by `--registry-path`).

**Repo-relative path**

Run an implicit dataset from a repo-relative directory:

    ```bash
    harbor run --repo "<org/repo-name>" -p "<path/to/tasks>" \
      -a "<agent>" -m "<model>"
    ```

**Default registry path**

Select a dataset from the repo's root-level `registry.json`:

    ```bash
    harbor run --repo "<org/repo-name>" -d "<dataset>" \
      -a "<agent>" -m "<model>"

    harbor run --repo "<org/repo-name>" -d "<dataset>@<version>" \
      -a "<agent>" -m "<model>"
    ```

**Custom registry path**

Select a dataset from a repo-relative registry path:

    ```bash
    harbor run --repo "<org/repo-name>" \
      --registry-path "<path/to/registry.json>" \
      -d "<dataset>" -a "<agent>" -m "<model>"
    ```

Without `-p` or `-d`, Harbor treats the repo's `tasks/` directory as an implicit dataset.

## Combining with other flags {#combining-with-other-flags}

Standard dataset flags work with `--repo`:

```bash
# Include specific tasks {#include-specific-tasks}
harbor run --repo "<org/repo-name>" -d "<dataset>" \
  -i "<task-a>" -i "<task-b>" \
  -a "<agent>" -m "<model>"

# Limit task count {#limit-task-count}
harbor run --repo "<org/repo-name>" -d "<dataset>" \
  -l "<count>" \
  -a "<agent>" -m "<model>"
```

> **注意** `--repo` cannot be combined with `--registry-url` or `--task` / `--task-git-url`.

## Repository layout {#repository-layout}

A git repository used with `--repo` should contain a `registry.json` at its root (or in the targeted subdirectory). This is the same format used by local `--registry-path`:

```bash
my-repo/
├── registry.json # optional, required for -d
└── tasks/
    ├── task-a/
    │   ├── task.toml
    │   ├── instruction.md
    │   ├── environment/
    │   └── tests/
    ├── task-b/
    │   └── ...
    └── ...
```

The `registry.json` maps dataset names to task lists. See [Tasks → Overview](/docs/core-concepts/tasks/overview) for task directory structure.

## Authentication {#authentication}

Public repositories work without any configuration. For private repositories, Harbor uses the Git credentials available in your environment (SSH keys, credential helpers, `GIT_ASKPASS`, etc.). If `git ls-remote` can reach the repo, `--repo` will work.
