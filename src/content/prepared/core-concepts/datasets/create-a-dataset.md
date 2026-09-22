# Create a Dataset {#create-a-dataset}

> Create a dataset of Harbor tasks

## Implicit datasets {#implicit-datasets}

The simplest way to create a dataset is to collocate a group of tasks in a directory.

```bash
my-dataset/
├── task1/
├── task2/
└── task3/
```

which can be run with:

```bash
harbor run -p ./my-dataset -a "<agent>" -m "<model>"
```

## Explicit datasets {#explicit-datasets}

You may want to define multiple datasets containing overlapping tasks. For example, you may have a directory of tasks defining an implicit dataset that you want to subset into categories.

In this case, copying and pasting the tasks is inconvenient, inefficient, and adds maintenance overhead.

Instead, you should create a `dataset.toml` manifest, which contains pointers to the task directories.

### Create a `dataset.toml` manifest {#create-a-dataset-toml-manifest}

To create a `dataset.toml` manifest, run

```bash
harbor dataset init "<org/name>"
```

which outputs a `dataset.toml` manifest in the current directory.

> **说明** Usually, `<org>` is the name of your company and `<name>` is the name of the dataset.

### Add and remove tasks {#add-and-remove-tasks}

To add tasks to the dataset, run

```bash
harbor dataset add "<task-dir>"
```

To remove tasks from the dataset, run

```bash
harbor dataset remove "<task-dir>"
```

You can also add and remove all tasks from another dataset

```bash
harbor dataset add "<other-dataset.toml>"
harbor dataset remove "<other-dataset.toml>"
```

### Run the `dataset.toml` {#run-the-dataset-toml}

To run the `dataset.toml` manifest, run

```bash
harbor run -p "<path-to-dataset.toml>"
```

## Publish a dataset {#publish-a-dataset}

To share your dataset with team members or publicly using Harbor Hub, run

```bash
harbor publish "<org/name>"
```

Think of Harbor Hub like PyPI or NPM rather than GitHub. Because tasks are software, development typically happens in a version-controlled repository and versions are published to Harbor Hub.

Once a dataset is published, anyone with access can run it using the `harbor run -d <org/name>` command.
