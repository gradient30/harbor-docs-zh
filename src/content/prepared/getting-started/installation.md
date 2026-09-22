# Installation {#installation}

> Install Harbor.

## Install Harbor {#install-harbor}

Install Harbor with a Python package manager.

**uv**

First, [install uv](https://docs.astral.sh/uv/getting-started/installation/).

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

## Nightly builds (not frequently used for most users) {#nightly-builds-not-frequently-used-for-most-users}

We publish [a dev release](https://pypi.org/project/harbor/#history) from the latest `main` to [PyPI](https://pypi.org/project/harbor/) daily. Install it with a pre-release flag (stable installs are unaffected):

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

## Configure a sandbox {#configure-a-sandbox}

Harbor runs agents in sandboxes. By default, Harbor uses [Docker](https://www.docker.com/) as the sandbox runtime, so you'll need to [have Docker installed](https://docs.docker.com/get-started/get-docker/) on your machine.

However, many users find it more productive to use a cloud sandbox. See [Pre-integrated sandboxes](/docs/core-concepts/sandboxes/pre-integrated-sandboxes) for a list of out-of-the-box cloud sandbox options.

For non-Docker sandboxes, you'll need to install the extra dependencies. E.g.

**uv**

```bash
    uv tool install "harbor[modal]"
    ```

**pip**

```bash
    pip install "harbor[modal]"
    ```
