# 发布策略 {#release-policy}

> Harbor 的稳定版与 nightly 发布策略。

Harbor 按需发布稳定版（通常每两周一次），并每日发布 nightly 版本。

## 稳定版 {#stable-releases}

维护者会在就绪时将稳定版发布到 [PyPI](https://pypi.org/project/harbor/)。[更新日志](/docs/changelog)会同步更新。

* **补丁版本：** 修复与增量改进，例如从 `0.22.0` 到
  `0.22.1`。
* **次要版本：** 用于**重大功能**或**破坏性变更**，例如从
  `0.22.x` 到 `0.23.0`。

安装最新稳定版：

```bash
uv tool install harbor
```

## Nightly 版本 {#nightly-releases}

Nightly 构建每天将最新 `main` 发布到 PyPI。版本号格式为
`<next-patch>.dev<timestamp>`，例如
[`0.22.1.dev202608271032`](https://pypi.org/project/harbor/0.22.1.dev202608271032/)。
所有稳定版与 nightly 版本见 [PyPI 发布历史](https://pypi.org/project/harbor/#history)。

安装最新 nightly 构建：

```bash
uv tool install --prerelease explicit "harbor>=0.dev0"
```

> **说明** Nightly 构建可提前获取尚未发布的变更，稳定性可能较低。
