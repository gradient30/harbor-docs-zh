# Skills {#skills}

> 从本地目录或 git 仓库注入可复用指令

Skills 让你将上下文文件、提示、规则和参考文档注入 Agent 试次。每个 Skill 是包含 `SKILL.md` 文件的目录。

## Skills 如何到达 Agent {#how-skills-reach-the-agent}

对每次试次，Harbor：

1. 在主机上将本地和 Git Skill 来源解析为各个 Skill 目录。
2. 将每个目录上传到 Agent 沙箱中的 `/harbor/skills/<skill-name>`。如果任务声明了 [`environment.skills_dir`](/docs/core-concepts/tasks/skills)，Harbor 改用该目录。
3. 在 Agent 设置之前，将沙箱 Skills 目录作为 `skills_dir` 传给 Agent 集成。
4. 由集成将其注册到原生位置，或直接将该目录传给 Agent 运行时。

例如，Codex 集成会将它们复制到 `$HOME/.agents/skills`，而 Claude Code 使用 `$CLAUDE_CONFIG_DIR/skills`。自定义 Agent 会收到相同的 `skills_dir` 构造函数参数，并应在 `setup()` 或 `run()` 期间注册其内容。

作业提供的 Skills 在环境健康检查之后、Agent 设置之前上传。当多个提供的 Skill 具有相同目录名时，以后者为准。要将 Skills 直接打包进任务环境，请参阅[任务 → Skills](/docs/core-concepts/tasks/skills)。

## 本地 Skills {#local-skills}

传入本地目录路径：

```bash
harbor run -d <dataset> -a <agent> \
  --skill <path/to/skill>
```

该路径可以指向一个包含 `SKILL.md` 的 Skill，也可以指向一个根目录，其直接子目录各自包含 `SKILL.md`。

## Git Skills {#git-skills}

不必把 Skills 检入每个项目，你可以引用 git 仓库。Harbor 会克隆仓库、解析提交 SHA，并将结果缓存到本地。

### 简写语法 {#shorthand-syntax}

```bash
# Default branch, reading skills from repo/skills/ {#default-branch-reading-skills-from-repo-skills}
harbor run --skill <org/repo> -a <agent> -d <dataset>

# Tag or branch, reading skills from repo/skills/ {#tag-or-branch-reading-skills-from-repo-skills}
harbor run --skill <org/repo>@<ref> -a <agent> -d <dataset>
```

简写始终解析到 `github.com`，并使用仓库的 `skills/` 目录。

### 完整 URL 语法 {#full-url-syntax}

```bash
# Default branch, reading skills from repo/skills/ {#default-branch-reading-skills-from-repo-skills}
harbor run --skill https://github.com/<org>/<repo> -a <agent> -d <dataset>

# Subdirectory within a repo (uses /tree/ref/path format) {#subdirectory-within-a-repo-uses-tree-ref-path-format}
harbor run --skill https://github.com/<org>/<repo>/tree/<ref>/<path/to/skill> \
  -a <agent> -d <dataset>
```

普通仓库 URL 使用仓库的 `skills/` 目录。`/tree/<ref>/<subdir>` 格式可指向 monorepo 中的特定子目录。

### 多个 Skills {#multiple-skills}

多次使用 `--skill` 可注入多个 Skill。如果两个 Skill 共享相同目录名，以后者为准：

```bash
harbor run \
  --skill <org/repo> \
  --skill <path/to/local-skill> \
  -a <agent> -d <dataset>
```

## 缓存 {#caching}

Git Skills 缓存在本地的 `~/.cache/harbor/skills/<host>/<org>/<name>/<sha>/`。提交一旦缓存，后续运行会跳过克隆。来自同一仓库和提交的不同子目录会自动处理。

要清除缓存：

```bash
rm -rf ~/.cache/harbor/skills
```

## 可复现性 {#reproducibility}

作业运行时，Harbor 会在作业锁文件中记录每个 Skill 的来源信息：

* **`name`** -- Skill 目录名
* **`source`** -- 运行期间使用的本地路径
* **`digest`** -- Skill 中所有文件的 SHA-256 内容哈希
* **`git_url`** -- 源仓库（针对 git Skills）
* **`git_commit_id`** -- 已解析的提交 SHA（针对 git Skills）

这确保作业结果可以完整追溯到所用的确切 Skill 内容，即使分支此后已经移动。
