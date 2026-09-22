# 安装 {#installation}

> 安装 Harbor。

## 安装 Harbor {#install-harbor}

使用 Python 包管理器安装 Harbor。

**uv**

首先，[安装 uv](https://docs.astral.sh/uv/getting-started/installation/)。

```bash
uv tool install harbor
```

**pip**

```bash
pip install harbor
```

**uv upgrade**

```bash
uv tool uninstall harbor
uv tool install harbor
```

## Nightly 构建（大多数用户不常用） {#nightly-builds-not-frequently-used-for-most-users}

我们每天会将最新 `main` 分支发布为 [dev 版本](https://pypi.org/project/harbor/#history) 到 [PyPI](https://pypi.org/project/harbor/)。使用预发布标志安装即可（不影响稳定版安装）：

**uv**

```bash
uv tool install --prerelease explicit 'harbor>=0.dev0'
```

**pip**

```bash
pip install --pre harbor
```

**uv upgrade**

```bash
uv tool uninstall harbor
uv tool install --prerelease explicit 'harbor>=0.dev0'
```

## 配置沙箱 {#configure-a-sandbox}

Harbor 在沙箱中运行 Agent。默认情况下，Harbor 使用 [Docker](https://www.docker.com/) 作为沙箱运行时，因此你需要在本机[安装 Docker](https://docs.docker.com/get-started/get-docker/)。

不过，许多用户发现使用云沙箱更高效。开箱即用的云沙箱选项见[预集成沙箱](/docs/core-concepts/sandboxes/pre-integrated-sandboxes)。

对于非 Docker 沙箱，需要安装额外依赖。例如：

**uv**

```bash
uv tool install "harbor[modal]"
```

**pip**

```bash
pip install "harbor[modal]"
```
