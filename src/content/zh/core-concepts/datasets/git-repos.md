# Git 仓库 {#git-repos}

> 从 Git 仓库运行数据集。

Harbor 可以使用 `--repo` 标志直接从 Git 仓库解析数据集。这样你就可以运行托管在任意 GitHub、GitLab 或 Hugging Face 仓库中的基准测试。

## 快速开始 {#quick-start}

```bash
harbor run --repo "<org/repo-name>" -a "<agent>" -m "<model>"
```

这会克隆仓库，默认运行 `tasks/` 目录中的任务。

## 指定仓库 {#specifying-the-repository}

`--repo` 标志接受多种格式：

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

未指定 `@ref` 时，使用仓库的默认分支。

## 选择数据集 {#selecting-a-dataset}

可以使用 `-p` 指定仓库内路径，或使用 `-d` 指定根级 `registry.json` 中定义的数据集（或由 `--registry-path` 指定）。

**仓库相对路径**

从仓库相对目录运行隐式数据集：

    ```bash
    harbor run --repo "<org/repo-name>" -p "<path/to/tasks>" \
      -a "<agent>" -m "<model>"
    ```

**默认注册表路径**

从仓库根级 `registry.json` 选择数据集：

    ```bash
    harbor run --repo "<org/repo-name>" -d "<dataset>" \
      -a "<agent>" -m "<model>"

    harbor run --repo "<org/repo-name>" -d "<dataset>@<version>" \
      -a "<agent>" -m "<model>"
    ```

**自定义注册表路径**

从仓库相对的注册表路径选择数据集：

    ```bash
    harbor run --repo "<org/repo-name>" \
      --registry-path "<path/to/registry.json>" \
      -d "<dataset>" -a "<agent>" -m "<model>"
    ```

未指定 `-p` 或 `-d` 时，Harbor 将仓库的 `tasks/` 目录视为隐式数据集。

## 与其他标志组合 {#combining-with-other-flags}

标准数据集标志可与 `--repo` 一起使用：

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

> **注意** `--repo` 不能与 `--registry-url` 或 `--task` / `--task-git-url` 组合使用。

## 仓库布局 {#repository-layout}

与 `--repo` 一起使用的 git 仓库应在根目录（或目标子目录）包含 `registry.json`。格式与本地 `--registry-path` 相同：

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

`registry.json` 将数据集名称映射到任务列表。任务目录结构请参阅[任务 → 概述](/docs/core-concepts/tasks/overview)。

## 身份验证 {#authentication}

公开仓库无需任何配置即可使用。对于私有仓库，Harbor 使用环境中可用的 Git 凭据（SSH 密钥、凭据助手、`GIT_ASKPASS` 等）。只要 `git ls-remote` 能访问该仓库，`--repo` 就可以工作。
