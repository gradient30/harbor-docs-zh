# Skills {#skills}

> 将可复用的 Agent 指令与任务打包在一起。

任务可以在其环境中包含 Skills，使运行该任务的每个 Agent 都收到相同的指令和参考文件。每个 Skill 都是一个包含 `SKILL.md` 文件的目录。

## 向任务添加 Skills {#add-skills-to-a-task}

将 Skills 放到环境构建上下文中：

```bash
my-task/
├── task.toml
└── environment/
    ├── Dockerfile
    └── skills/
        └── <skill-name>/
            ├── SKILL.md
            └── ...
```

将它们复制进镜像：

```dockerfile
FROM <base-image>

COPY skills/ /skills/
```

然后将 `environment.skills_dir` 指向该沙箱目录：

```toml
[environment]
skills_dir = "/skills"
```

使用沙箱内的绝对路径。当任务 Skills 与作业运行时提供的 Skills 合并时，这一点是必需的。

## Harbor 如何传递任务 Skills {#how-harbor-passes-task-skills}

Harbor 不会单独上传任务的 Skill 文件：它们已经存在于构建或预构建环境的 `environment.skills_dir` 中。在创建 Agent 之前，Harbor 将该路径作为 `skills_dir` 传给 Agent 集成。

兼容的预集成 Agent 随后会将 Skills 复制或注册到其原生配置目录。自定义 Agent 会在构造函数中收到 `skills_dir`，并应在 `setup()` 或 `run()` 期间使用它。该路径在沙箱中同样可用。

> **说明** 设置 `environment.skills_dir` 并不会把文件复制进环境。请确保该目录已存在于构建或预构建镜像中。

## 合并任务 Skills 与作业 Skills {#combine-task-and-job-skills}

[作业提供的 Skills](/docs/core-concepts/jobs/skills) 会被上传到任务的 `environment.skills_dir`，因此 Agent 通过同一个目录同时接收两个来源。作业提供的 Skill 会在该试次中替换同名目录的打包 Skill。

如果任务未声明 `environment.skills_dir`，作业提供的 Skills 将使用 `/harbor/skills`。
