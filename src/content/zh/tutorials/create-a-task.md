# 创建任务 {#create-a-task}

> 构建并测试你的第一个 Harbor 任务。

## 步骤 0：安装 Harbor {#step-0-install-harbor}

请按照[安装说明](/docs/getting-started/installation)安装 Harbor，包括安装软件包及其依赖。

## 步骤 1：创建任务 {#step-1-create-your-task}

Harbor 安装完成后，运行以下命令以创建包含所需文件的新任务目录：

```bash
harbor task init ssh-key-pair
```

这将生成如下结构的任务目录：

```bash
ssh-key-pair/
├── instruction.md         # 任务指令
├── task.toml              # 配置与元数据
├── environment/
│   └── Dockerfile         # 容器定义
├── solution/
│   └── solve.sh           # 解答脚本
└── tests/
    │── test_outputs.py    # Pytest 单元测试
    └── test.sh            # 测试验证脚本
```

## 步骤 2：编写任务指令 {#step-2-write-the-task-instructions}

打开任务目录中的 `instruction.md` 文件并添加任务描述：

```markdown
# SSH Key Pair Generation {#ssh-key-pair-generation}

Generate an SSH key pair in the files `~/.ssh/id_rsa` and `~/.ssh/id_rsa.pub`.

Don't make them password protected.
```

## 步骤 3：配置任务元数据 {#step-3-configure-task-metadata}

打开 `task.toml` 文件并配置任务元数据：

```toml
version = "1.0"

[metadata]
author_name = "Your Name"
author_email = "your.email@example.com"
difficulty_explanation = "Simple SSH key generation command"
category = "system-administration"
tags = ["ssh", "cryptography", "linux"]

[verifier]
timeout_sec = 120.0

[agent]
timeout_sec = 120.0

[environment]
build_timeout_sec = 600.0
```

在此处添加 `os = "windows"` 可面向 Windows 容器；默认值为 `"linux"`。当任务需要显式资源时，添加 `cpus`、`memory_mb`、`storage_mb` 或 `gpus`。

## 步骤 4：创建任务环境 {#step-4-create-the-task-environment}

打开已生成的 `environment/` 目录中的 Dockerfile：

```dockerfile
FROM ubuntu:24.04

# Create working directory {#create-working-directory}
WORKDIR /app

# Install openssh-client for the task {#install-openssh-client-for-the-task}
RUN apt-get update && apt-get install -y openssh-client && rm -rf /var/lib/apt/lists/*
```

该 Dockerfile 定义了 Agent 将通过终端交互的环境。在此添加任务所需的任何依赖。

## 步骤 5：测试你的解答思路 {#step-5-test-your-solution-idea}

在编写自动化解答之前，应先手动验证该方法可行。交互式构建并运行容器：

```bash
harbor task start-env -p ssh-key-pair -e docker -a -i # or use daytona or modal
```

在容器内，测试以下命令能否在无需交互输入的情况下完成任务：

```bash
ssh-keygen -t rsa -f ~/.ssh/id_rsa -N ""
```

验证密钥是否已正确创建：

```bash
ls -l ~/.ssh/id_rsa*
```

你应该看到：

```
~/.ssh/
├── id_rsa      (-rw-------  600  private key)
└── id_rsa.pub  (-rw-r--r--  644  public key)
```

使用 `exit` 或 `Ctrl+D` 退出容器。

## 步骤 6：编写解答脚本 {#step-6-write-the-solution-script}

将上一步验证过的命令写入解答脚本。Oracle Agent 将使用该文件确认任务可解。

更新 `solution/solve.sh` 文件：

```bash
#!/bin/bash

ssh-keygen -t rsa -f ~/.ssh/id_rsa -N ""
```

确保脚本可执行：

```bash
chmod +x ssh-key-pair/solution/solve.sh
```

## 步骤 7：创建测试脚本 {#step-7-create-the-test-script}

测试脚本用于验证 Agent 是否成功完成任务。它必须在 `/logs/verifier/` 中生成奖励文件。本教程为简洁起见使用 pytest；若需要多准则验证器、加权评分或 LLM-as-a-judge 评分量表，请考虑改用 [RewardKit](/docs/core-concepts/rewardkit/quick-start)。

更新 `tests/test.sh` 文件：

```bash
#!/bin/bash

apt-get update
apt-get install -y curl

curl -LsSf https://astral.sh/uv/0.9.5/install.sh | sh

source $HOME/.local/bin/env

# Run pytest tests {#run-pytest-tests}
uvx \
  --python 3.12 \
  --with pytest==8.4.1 \
  pytest /tests/test_outputs.py

# Check exit code and write reward {#check-exit-code-and-write-reward}
if [ $? -eq 0 ]; then
  echo 1 > /logs/verifier/reward.txt
else
  echo 0 > /logs/verifier/reward.txt
fi
```

接下来创建 Python 测试文件：

```python
import os
from pathlib import Path

def test_key_files_exist() -> None:
    """Test that both private and public key files exist."""
    private_key = Path.home() / ".ssh" / "id_rsa"
    public_key = Path.home() / ".ssh" / "id_rsa.pub"

    assert private_key.exists(), "Private key file does not exist"
    assert public_key.exists(), "Public key file does not exist"

def test_key_file_permissions() -> None:
    """Test that the key files have correct permissions."""
    private_key = Path.home() / ".ssh" / "id_rsa"
    public_key = Path.home() / ".ssh" / "id_rsa.pub"

    private_perms = oct(os.stat(private_key).st_mode)[-3:]
    public_perms = oct(os.stat(public_key).st_mode)[-3:]

    assert private_perms == "600", (
        f"Private key has incorrect permissions: {private_perms}"
    )
    assert public_perms == "644", (
        f"Public key has incorrect permissions: {public_perms}"
    )

def test_key_format() -> None:
    """Test that the public key has the correct RSA format."""
    public_key = Path.home() / ".ssh" / "id_rsa.pub"

    with open(public_key, 'r') as f:
        content = f.read()

    assert content.startswith("ssh-rsa "), "Public key does not start with 'ssh-rsa'"
    assert len(content.split()) >= 2, "Public key format is invalid"
```

## 步骤 8：使用 Oracle Agent 测试任务 {#step-8-test-your-task-with-the-oracle-agent}

运行以下命令，验证解答脚本能否完成任务：

```bash
harbor run -p ssh-key-pair -a oracle
```

若成功，你应看到表明任务已完成且奖励为 1 的输出。

<Callout type="info" title="故障排除">
  如果 Oracle Agent 失败，请检查：

  * 解答脚本具有执行权限
  * Dockerfile 安装了所有所需依赖
  * 测试脚本正确写入 `/logs/verifier/reward.txt`
  * 测试中的路径与解答中的路径一致
</Callout>

## 步骤 9（可选）：使用真实 Agent 测试 {#step-9-optional-test-with-a-real-agent}

使用真实 AI Agent 测试任务，看它能否完成。例如，使用 Claude-Code 搭配 Haiku：

```bash
harbor run \
  -p ssh-key-pair \
  -a claude-code \
  -m anthropic/claude-haiku-4-5
```

## 步骤 10（可选）：在查看器中检查输出 {#step-10-optional-inspect-the-output-in-the-viewer}

启动查看器以浏览本次运行的轨迹、验证器日志和产物：

```bash
harbor view ./jobs
```

打开最新作业，选择 `ssh-key-pair` 试次，并查看 **Verifier Logs** 选项卡，以查看 pytest 输出和最终奖励。**Trajectory** 选项卡会逐步展示 Agent 采取的每一步——在调试真实 Agent 为何未通过任务时非常有价值。

## 步骤 11：庆祝 {#step-11-celebrate}

恭喜！你已经创建了第一个 Harbor 任务。该任务现在可以用于对 AI Agent 进行基准测试！
