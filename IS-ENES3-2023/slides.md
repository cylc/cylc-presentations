---
fonts:
  sans: 'lato'
  fallback: false
layout: title
image: '/img/metoffice-globe-background.jpg'
logo: /img/MO_MASTER_for_dark_backg_RBG.png
---

<div style="position: relative; top: -100px;">
<img width="300" src="/img/cylc-logo-white.svg" />
<div style="font-size: 0.65em">
An introduction to the Cylc workflow engine

Oliver Sanders (Met Office)

<p style="
    font-size: 0.65em;
    line-height: 1.5;
    color: rgb(100,100,150)
">
IS-ENES3 has received funding from the European Union's
<br />
Horizon 2020 research and innovation programme under
<br />
grant agreement No 824084.
</p>
</div>
</div>

<!--

* Hello
* Cylc is what we refer to as a "workflow engine".
* Also referred to as a "meta-scheduler" in the HPC domain.
* "scheduler", "DAG engine", and "workflow management system" all also
  are similar related terms.
* To help explain what Cylc is and how it compares here's a techincal
  description.

-->


---
layout: title
---

Cylc is a

::one::
decentralised
::two::
distributed
::three::
DAG/DCG
::four::
scheduler

<!--

* Lets go through each of those terms in turn.

-->

---

### Cylc is a <b style="color: #55c3e5ff;">scheduler</b>

Cylc is a system for workflow definition and execution.

<!--

* A scheduler is a system which allows you to define your workflow in terms of
* **Tasks**, the actions you want to perform,
  * Say retrieving data, or running a numerical model.
* And the **Dependencies** which represent the flow of data between these
  tasks.

-->

---
layout: cover
---

### Cylc is a <b style="color: #64c77eff;">DAG</b> scheduler

Cylc can schedule directed *acyclic* graphs (DAGs).

<minicylc
  width="300"
  graph="a => b => c\nb => d\nd => f\ne => f"
  :cycles="0"
  :stepTime="2500"
  svg="/graph/abc.svg"
/>

<!--

* A DAG can be represented in a diagram like this one.
* Nodes represent tasks.
* Edges represent dependencies.
* A DAG scheduler executes each task in the appropriate order,
  waiting for dependencies to complete before moving to the next one.

-->

---

### Cylc is a <b style="color: #64c77eff;">DCG</b> scheduler

Cylc can schedule directed *cyclic* graphs (D**C**Gs).

<img style="float:left;" src="/graph/abc-acycle.png" width="150" />
<img v-click style="float:right;" src="/graph/abc-cycle.png" width="400" />

<!--

* Our problems are often cyclic in nature.
* The blue arrows in this graph introduce **loops** or **cycles**.
* This makes it a **cyclic** graph or D **C** G.
* Cyclic problems appear in many domains, but especially in 
  environmental modelling where we are typically
  iterating in the time dimension.
* Cylc solves cyclic graphs by unrolling them into another dimension.

-->

---

### Cylc is <b style="color: #f75f5fff;">decentralised</b>

<br /><br />

<img width="600" class="mx-auto" src="/img/decentralised-new.svg" />

<!--

* With the centralised approach a single scheduler runs multiple
  "graphs" or "workflows".
* With a decentralised approach, one scheduler runs one
  workflow with multiple scheduler instances running in parallel.
* The decentralised approach is harder to develop as it requires logic
  for discovering, monitoring and controlling multiple scheduler instances.
* However, it has some major advantages.

-->

---

### Cylc is <b style="color: #f75f5fff;">decentralised</b>

<br /><br />

<img width="600" class="mx-auto" src="/img/decentralised-new-2.svg" />

<!--

* With the centralised approach, as you add more workflows to the
  scheduler you will eventually hit an artificial workload cap,
  determined by the hardware you are running it on.
* With the decentralised approach there is no artificial workload cap,
  and the setup scales endlessly.
* So the scaling limits of the scheduler apply on a per-workflow basis rather
  than a per-deployment basis.
* As each scheduler is isolated, this approach is also more robust.

-->

---

### Cylc is <b style="color: #f0c84bff;">distributed</b>

<br /><br />
<img width="700" class="mx-auto" src="/img/distributed-simple.svg" />

<!--

* Cylc has some distribution capabilities.
* Cylc can distribute scheduler instances amongst a pool of servers.
  * And can use load balancing to do so.
* It can also distribute jobs across multiple submission nodes.
* Cylc can install required resources onto remote file systems as required.

-->


---

### Cylc is open source

Cylc runs on unix systems:

```
$ conda install -c conda-forge cylc-flow
$ pip install cylc-flow
```

<!--

* Cylc started at the New Zealand national institution of Water and Atmospheric
  Research, NIWA.
* It is now run by an international collaboration including NIWA and the Met
  Office.
* Cylc can be installed via Conda & Pip.

-->


---
layout: title
---

Hello World!
::one::
<carbon-code />
::two::
<carbon-terminal />
::three::
<carbon-tool-kit />
::four::
<carbon-play-filled />

<!--

* Let's start with the time honored tradition of "Hello World!" and
  write an example DAG with Cylc.

-->

---
layout: two-cols
---

### This is a **DAG**

<br />

```ini
[scheduling]
    [[graph]]
        R1 = """
            a => b => d => f
            b => c
            e => f
        """

[runtime]
    [[a, b, c, d, e, f]]
        script = echo "Hello $CYLC_TASK_NAME"
```

::right::

<br /><br />
<img width="300" class="mx-auto" src="/graph/dag.png" />

<!--

* On the left is a Cylc configuration.
* And on the right is a graphical representation of it.

-->

---
layout: two-cols
---

### This is a **DAG**

<br />

```ini {4,5,6}
[scheduling]
    [[graph]]
        R1 = """
            a => b => d => f
            b => c
            e => f
        """

[runtime]
    [[a, b, c, d, e, f]]
        script = echo "Hello $CYLC_TASK_NAME"
```

::right::

<br /><br />
<img width="300" class="mx-auto" src="/graph/dag.png" />

<!--

* First, we define the "graph".
* Here I've defined some tasks and given them single letter names.
* The arrows represent the dependencies between them.

-->

---
layout: two-cols
---

### This is a **DAG**

<br />

```ini {3}
[scheduling]
    [[graph]]
        R1 = """
            a => b => d => f
            b => c
            e => f
        """

[runtime]
    [[a, b, c, d, e, f]]
        script = echo "Hello $CYLC_TASK_NAME"
```

::right::

<br /><br />
<img width="300" class="mx-auto" src="/graph/dag.png" />

<!--

* **R1** tells Cylc to **run** this graph **once**.

-->

---
layout: two-cols
---

### This is a **DAG**

<br />

```ini {11}
[scheduling]
    [[graph]]
        R1 = """
            a => b => d => f
            b => c
            e => f
        """

[runtime]
    [[a, b, c, d, e, f]]
        script = echo "Hello $CYLC_TASK_NAME"
```

::right::

<br /><br />
<img width="300" class="mx-auto" src="/graph/dag.png" />

<!--

* And the **script** setting tells Cylc what I want each task to do.
* In this case it will write the name of the task into a log file.
* This script could be anything from an echo script to a model run.
* ...
* This is a simple workflow suitable for running a collection of
  inter-dependent tasks.
* Which could be used to solve a data-pipeline problem.
* ...
* Now, what if we wanted to turn this into a cycling workflow?

-->

---
layout: two-cols
---

### This is a **DCG**

<br />

```ini {2,3}
[scheduling]
    cycling mode = integer
    initial cycle point = 1
    [[graph]]
        P1 = """
            a => b => d => f
            b => c
            e => f

            b[-P1] => b
            f[-P1] => e
        """

[runtime]
    [[a, b, c, d, e, f]]
        script = echo "Hello $CYLC_TASK_NAME"
```

::right::

<br /><br />
<img width="400" class="mx-auto" src="/graph/dcg.png" />

<!--

* First we tell Cylc we want it to number our cycles by setting the **cycling mode** to **integer**.
* Then tell Cylc to start counting from the number 1 by setting the **initial cycle point**.
* The graph on the right shows the first three cycles, labeled 1, 2 & 3.

-->

---
layout: two-cols
---

### This is a **DCG**

<br />

```ini {5,10,11}
[scheduling]
    cycling mode = integer
    initial cycle point = 1
    [[graph]]
        P1 = """
            a => b => d => f
            b => c
            e => f

            b[-P1] => b
            f[-P1] => e
        """

[runtime]
    [[a, b, c, d, e, f]]
        script = echo "Hello $CYLC_TASK_NAME"
```

::right::

<br /><br />
<img width="400" class="mx-auto" src="/graph/dcg.png" />

<!--

* We then change **R1** meaning "run once" for **P1** meaning, run every cycle.
* And we tell Cylc about the dependencies between cycles
  * `b[-P1]` means the task "b" from the previous cycle.
  * So "b" in this cycle depends on "b" in the previous cycle.
* ...
* Now we have a cycling workflow that's suitable for solving a repeating
  problem.
* E.G. Processing a dataset in chunks.
* ...
* In environmental modelling our problems are typically cyclic in time.
* What if we wanted Cylc to count cycles with times rather than numbers?

-->

---
layout: two-cols
---

### This is date-cycling DCG
### (**simulated time**)

```ini {2,3,5,10,11}
[scheduling]
    cycling mode = gregorian
    initial cycle point = now
    [[graph]]
        P1D = """
            a => b => d => f
            b => c
            e => f

            b[-P1D] => b
            f[-P1D] => e
        """

[runtime]
    [[a, b, c, d, e, f]]
        script = echo "Hello $CYLC_TASK_NAME"
```

::right::

<br /><br />
<img width="400" class="mx-auto" src="/graph/dcg-sim.png" />

<!--

* To get Cylc to count cycles with dates and times rather than numbers.
* We change the cycling mode to use the Gregorian calendar.
* And, here I've set the initial cycle point to the current time.
* ...
* Next we change `P1` meaning a period of one **cycle**.
* To `P1D` meaning a period of one **day**.
* ...
* This workflow is now running in simulated time, repeating every day.
* This might be useful for a climate study where you are running over a
  range of dates, perhaps using archived data.
* ...
* What if we wanted this workflow to run in **real** time.

-->

---
layout: two-cols
---

### This is date-cycling DCG
### (**[real time](https://cylc.github.io/cylc-doc/stable/html/workflow-design-guide/general-principles.html#clock-triggered-tasks)**)

```ini {6}
[scheduling]
    cycling mode = gregorian
    initial cycle point = now
    [[graph]]
        P1D = """
            @wall_clock => a

            a => b => d => f
            b => c
            e => f

            b[-P1D] => b
            f[-P1D] => e
        """

[runtime]
    [[a, b, c, d, e, f]]
        script = echo "Hello $CYLC_TASK_NAME"
```

::right::

<br /><br />
<img width="400" class="mx-auto" src="/graph/dcg-real.png" />

<!--

* We add a dependency on "wall clock" for the first task in each cycle.
* Where wall clock refers to the real time.
* ...
* Now we have a workflow which would be suitable for a real time monitoring
  system.
* ...
* We've now taken the same workflow through four modes of operation.
  * Acyclic
  * Integer cycling
  * Simulated time
  * Real time
* With Cylc we aim to make it easy to start with a simple example...
* ...and grow the configuration into a more advanced pattern as needed.

-->


---
layout: title
---

Scheduler Features
::one::
<carbon-connection-signal />
::two::
<carbon-branch />
::three::
<carbon-insert />
::four::
<carbon-skip-forward-outline-solid />

---

<minicylc
  width="100%"
  height="100%"
  graph="a => b => c\nb => d\nd => f\ne => f\nb[-P1] => b\nf[-P1] => e\nb[-P5] => a\nf[-P5] => a"
  :cycles="40"
  :follow="true"
  svg="/graph/abc-cycle-inf.svg"
/>

<div style="position: absolute; top: 10%; right: 5%;">
Cylc constructs a
<a href="https://cylc.github.io/cylc-doc/stable/html/glossary.html#term-n-window)"
>moving window</a>
over a cycling workflow.
</div>

<!--

* This is a simulation showing how Cylc runs a cyclic graph.
* Which shows some of the features of the Cylc scheduler.
* ...
* Cylc doesn't just wait for one cycle to finish before moving onto the next.
* It runs multiple cycles concurrently.
* ...
* One part of the workflow is running slower than another.
* Cylc runs ahead as far as it can to make as much progress as it is able to.
* ...
* To prevent it from getting too far ahead, I've configured a
  **runahead limit** of five cycles.
* Which means that it will only run tasks up to five cycles ahead of the slowest
  cycle.
* For date-time cycling workflows the runahead limit can by a time range
  e.g. 2 days.
* ...
* Cylc doesn't load the whole graph into memory.
* It constructs a moving window over the workflow...
* ...which consists only of the active tasks.
* This means:
  * Cylc can handles large workflows efficiently.
  * And...

-->

---
layout: points
---

<v-clicks>

* <span>∞</span> Workflows can be infinite.
* <carbon-connection-signal />
  [Xtriggers](https://cylc.github.io/cylc-doc/stable/html/glossary.html#term-xtrigger)
  can respond to external events.
* <carbon-port-input />
  [Inter-workflow triggers](https://cylc.github.io/cylc-doc/stable/html/user-guide/writing-workflows/external-triggers.html#built-in-workflow-state-triggers)
  can trigger off of tasks in other workflows.
* <carbon-message-queue /> 
  [Internal queueing mechanism](https://cylc.github.io/cylc-doc/stable/html/glossary.html#term-queue)
  for controlling parallelism and submission load.

</v-clicks>

<!--

* Workflows can be infinite.
* Xtriggers can respond to external events.
  * Xtriggers are Python functions you can write to respond to external events.
* Inter-workflow triggers can trigger off of tasks in other workflows.
  * Allowing a decentralised collection of schedulers to interact.
* Internal queueing mechanism for controlling parallelism and submission load.

-->

---
layout: two-cols
---

<div style="text-align: center; width: 100%; font-size: 1.35em">
<carbon-branch />

<a href="https://cylc.github.io/cylc-doc/stable/html/glossary.html#term-graph-branching">
  Branched graphs
</a>
with
<a href="https://cylc.github.io/cylc-doc/stable/html/glossary.html#term-stall">
stall detection.
</a>

</div>
<br />

```shell
# branch the graph depending on the outcome of "a"
a:x? => x1 => x2
a:y? => y1 => y2
a:z? => z1 => z2

# join the graph back together
x2 | y2 | z2 => b
```

::right::

<br />
<br />
<br />

<img width="300" class="mx-auto" src="/graph/branch.png" />

<!--

* Cylc supports branched graphs.
* In this example Cylc will follow one of three paths through the graph
  depending on the outcome of the first task.
* This can also be used for automated failure recovery / error handling. 
* Cylc has built-in stall detection which alerts you if the pathway through the
  graph has become blocked.

-->

---
layout: cover
---

#### <carbon-event-schedule /> Schedule tasks with [ISO8601 recurrences](https://cylc.github.io/cylc-doc/stable/html/tutorial/scheduling/datetime-cycling.html#iso8601-durations) (with extensions):

```ini
P1D = foo        # every day
P1D ! P3D = bar  # every day, except every third day
01T-30 = baz     # every hour, at half past on the first day of the month
```

<v-click>

#### <carbon-calendar-heat-map /> [Alternate calendar support](https://cylc.github.io/cylc-doc/stable/html/reference/config/workflow.html#flow.cylc[scheduling]cycling%20mode):

```plain
360-day
365-day
366-day
```
</v-click>

<!-- RRULE support in the works? -->

<v-click>

#### <carbon-tool-kit /> [Utilities for date-time arthritic:](https://github.com/metomi/isodatetime#usage)

```shell
$ isodatetime 20000101T00 --offset P1Y --offset P1DT12H
20010102T12

$ isodatetime R/2020/P1Y --max=3
2020-01-01T00:00:00Z
2021-01-01T00:00:00Z
2022-01-01T00:00:00Z
```
</v-click>

<!--

#### <carbon-event-schedule /> Schedule tasks with extended ISO8601 recurrences:

* Cylc uses ISO8601 recurrences to define the schedule that tasks run to.
* Three examples here...
* These recurrences can be combined to create more complex sequences.
* You can have different parts of a workflow running to different schedules.
  * e.g. one task run every 5 minutes, and another could run every 5 years.
* Use any number of recurrences in a workflow.
* Inter-cycle dependencies between recurrences.

#### <carbon-calendar-heat-map /> Alternate calendar support:

* Cylc supports the Gregorian calendar.
* But also the 360, 65 & 66 day calendars often used in climate research.

#### <carbon-tool-kit /> Utilities for date-time arthritic:

* To make working with cycling systems easier.
* Cylc provides utilities for date-time arthritic.
* Which work with climate calendars.
* Two examples here...
  * The first take a date-time and adds two durations to it.
  * The second lists the first three dates on a recurrence.

-->

---

#### <carbon-bare-metal-server /> Submit jobs to industry strength [batch systems](https://cylc.github.io/cylc-doc/stable/html/user-guide/task-implementation/job-submission.html#availablemethods) out of the box:

```ini
[platforms]
  [[hpc2]]
    hosts = hpc1.login.1
    job runner = pbs
  [[hpc2]]
    hosts = hpc2.login.1
    job runner = sge
  [[cluster]]
    job runner = slurm
```

<v-click>

#### <carbon-plug /> Generic interface for defining integration with other job runners.

```python
class SLURMHandler():
    DIRECTIVE_PREFIX = "#SBATCH "
    KILL_CMD_TMPL = "scancel '%(job_id)s'"
    POLL_CMD = "squeue -h"
    REC_ID_FROM_POLL_OUT = re.compile(r"^ *(?P<id>\d+)")
    SUBMIT_CMD_TMPL = "sbatch '%(job)s'"
```

</v-click>

<!--

#### <carbon-bare-metal-server /> Submit jobs to industry strength batch systems out of the box:

* Cylc can run jobs locally on the machine the scheduler is running on.
* But we typically submit jobs to a remote batch system.
* Cylc supports, PBS, Slurm, LSF and others.

#### <carbon-plug /> Generic interface for defining integration with other job runners.

-->


---
layout: title
---

Intervention
::one::
<carbon-close-filled />
::two::
<carbon-connect-reference />
::three::
<carbon-catalog-publish />
::four::
<carbon-paint-brush-alt />

<!--

* Now we'll take a look at how we interact with Cylc workflows.
* Cylc supports a rich range of interventions and controls to suit both
  development and production purposes.
-->

---
layout: points
---

<v-clicks>

* <carbon-repeat /> Workflow definition can be
  [ reloaded](https://cylc.github.io/cylc-doc/stable/html/glossary.html#term-reload)
  at runtime.
* <carbon-edit /> Task configuration can be
  [ edited on the fly](https://cylc.github.io/cylc-doc/stable/html/user-guide/running-workflows/dynamic-behaviour.html#cylc-broadcast).
* <carbon-tool-kit /> Multi-workflow & multi-task operations.
* <carbon-pause-outline-filled /> Workflows and tasks can be held back and released.

</v-clicks>

<!--

#### <carbon-repeat /> Workflow definition can be reloaded at runtime.
* You can add/remove tasks and even change the graph structure
  whilst the workflow is running.

#### <carbon-edit /> Task configuration can be edited on the fly.
* Operators can make temporary changes which expire after a configured cycle.
* Which is useful for responding to events in real time.

#### <carbon-tool-kit /> Multi-workflow & multi-task operations.
* Although Cylc uses a decentralised architecture.
* You can perform an intervention on a group of workflows with a single
  operation.

#### <carbon-pause-outline-filled /> Workflows and tasks can be held back and released.
* Allowing you to pause all or part of a workflow.
* e.g. To allow you to reconfigure it in real time.

-->

---
layout: points
---

<v-clicks>

* <carbon-skip-forward-solid-filled /> Dependencies & outputs can be manually overridden.
* <carbon-skip-back-solid-filled /> Workflows can be "re-winded" and sections
  [ re-run.](https://cylc.github.io/cylc-doc/stable/html/user-guide/running-workflows/reflow.html#user-guide-reflow)

</v-clicks>

<!--

#### <carbon-skip-forward-solid-filled /> Dependencies & outputs can be manually overridden.
* If a workflow encounters problems.
* You can take direct control over Cylc's scheduling.
* You can fix problems in the data by hand or by using processes outside of
  Cylc.
* Providing operators with maximum flexibility to solve even complex issues.

#### <carbon-skip-back-solid-filled /> Workflows can be "re-winded" and sections re-run.
* E.G. if a problem goes undetected and you need to go back a few steps, make a
  change, and re-run to recover.

-->


---
layout: title
---

Monitoring & Control
::one::
<carbon-activity />
::two::
<carbon-audio-console />
::three::
<carbon-chart-relationship />
::four::
<carbon-user-multiple />

<!--

These interventions can all be performed on the command line.

Or alternatively through one of the user interfaces.

-->

---
layout: two-cols
clicks: 3
---

## Terminal User Interface ([Tui](https://cylc.github.io/cylc-doc/stable/html/7-to-8/major-changes/ui.html#cylc-tui))

A simple CLI interface that runs out the box.

<ul>
  <li v-click="1">Monitor a workflow</li>
  <li v-click="2">View job submissions</li>
  <li v-click="3">Perform basic interventions</li>
</ul>

::right::

<div>
    <img v-click="1" width="400" style="position: absolute;" src="/img/tui-1.png" />
    <img v-click="2" width="400" style="position: absolute;" src="/img/tui-2.png" />
    <img v-click="3" width="400" style="position: absolute;" src="/img/tui-3.png" />
</div>

<!--

* A simple CLI interface that runs out the box.
* Which is highly portable.
* Monitor a workflow.
  * With a text based view which shows the active tasks and cycles in a
    workflow.
  * And their statuses.
* View job submissions.
  * Where you can see the platform, job ID and timing information.
* Perform basic interventions.
  * E.G. kill or trigger a task.
  * Start or stop a workflow.

-->

---
clicks: 6
---

## Graphical User Interface ([GUI](https://cylc.github.io/cylc-doc/stable/html/7-to-8/major-changes/ui.html#cylc-web-gui))

An advanced single-user multi-workflow dashboard.

<div>
    <img width="550" style="position: absolute;" src="/img/gui.png" />
    <img v-click="1" width="550" style="position: absolute;" src="/img/gui-1.png" />
    <img v-click="2" width="550" style="position: absolute;" src="/img/gui-2.png" />
    <img v-click="3" width="550" style="position: absolute;" src="/img/gui-3.png" />
    <img v-click="4" width="550" style="position: absolute;" src="/img/gui-table.png" />
    <img v-click="5" width="550" style="position: absolute;" src="/img/gui-log.png" />
    <img v-click="6" width="550" style="position: absolute;" src="/img/gui-cmd.png" />
</div>


<!--

* There is also a graphical user interface which runs in the browser.
* It lists workflows and displays their statuses.
* There's a text based view similar to Tui.
* And a graphical representation of the workflow structure.
* There's also a sortable table containing job submission information.
* And you can stream job output in real time.
* Full support for CLI interventions.
* There's currently a workflow analysis view in the works.
  * To help you see how tasks are performing.
* More views planned.
* ...
* The Cylc GUI is implemented as a Jupyter Server extension which means you can
  run it alongside Jupyter Lab in the same server instance.
-->

---

## Multi-User [Hub](https://cylc.github.io/cylc-doc/stable/html/reference/architecture/ui-server.html#multi-user-mode)

A JupyterHub powered multi-user dashboard.

<img width="400" style="position: absolute;" src="/img/jhub-parts.png" />

<!--

* It's a way of deploying the GUI for multi-user setups, powered by JupyterHub.
* Which is useful for site installations.
* It starts GUI servers for users on request.
* It has an authorisation layer which allows
  - Users to be granted permissions to perform selected operations
    on workflows running under other user accounts.
* This is useful for situations where you have teams of people working on
  the same workflows.
* ...
* If you have an existing Jupyter Hub deployment,
  perhaps for running Jupyter Lab...
* ...You can install the Cylc GUI into the Jupyter Lab ab environment and
  serve both together.

-->


---
layout: title
---

Production
::one::
<carbon-rocket />
::two::
<carbon-event-schedule />
::three::
<carbon-checkmark-filled-warning />
::four::
<carbon-enterprise />

<!--

* Cylc is a production grade scheduler.

-->


---
layout: points
---

<v-clicks>

* <carbon-rocket /> Production ready since 2010!
* <carbon-power /> Restart / power-out safety.
* <carbon-retry-failed /> [Automatic retries](https://cylc.github.io/cylc-doc/stable/html/tutorial/furthertopics/retries.html).
* <carbon-classifier-language /> Robust
  [ job communication.](https://cylc.github.io/cylc-doc/stable/html/reference/config/global.html#global.cylc[platforms][%3Cplatform%20name%3E]communication%20method)

</v-clicks>

<!--
#### <carbon-rocket /> Production ready since 2010!
* Cylc has been used in production for 13 years.

#### <carbon-power /> Restart / power-out safety.
* Workflows can be stopped/restarted/paused/resumed any number of times.
* Cylc maintains the workflow state and can reconnect to running jobs when
  restarted.
* You can also start/resume a workflow from any arbitrary point in the graph.

#### <carbon-retry-failed /> Automatic retries.
* Cylc can be configured to automatically retry jobs which failed to submit or
  execute.
* Support for modifying task configuration for retried tasks.
* e.g. if your model run fails you could configure it to retry with a shorter timestep

#### <carbon-classifier-language /> Task communication.
* Cylc jobs communicate their progress back to the Scheduler.
* This communication can operate over TCP or SSH.
* However, Cylc can operate in the absence of 2-way-communication by polling.
* Even when comms is available Cylc will still poll jobs occasionally making it
  robust against:
  + Critical failures / power-out scenarios.
  + Batch scheduler failures.
  + Network issues.

-->

---
layout: points
---

<v-clicks>

* <carbon-bare-metal-server /> Advanced
  [ platform configuration.](https://cylc.github.io/cylc-doc/stable/html/reference/config/global.html#global.cylc[platforms])
* <carbon-direction-loop-right-filled />
  [ Workflow](https://cylc.github.io/cylc-doc/stable/html/reference/config/workflow.html#flow.cylc[scheduler][events]) &
  [ task](https://cylc.github.io/cylc-doc/stable/html/reference/config/workflow.html#flow.cylc[runtime][%3Cnamespace%3E][events])
  lifecycle hooks for integrations.
* <carbon-time /> Seamless transition from simulated to real time.
* <carbon-increase-level /> Strong scaling characteristics.
* <carbon-enterprise /> Trusted by
  [ sites world wide](https://cylc.github.io/community).

</v-clicks>


<!--
* <carbon-bare-metal-server /> Platforms.
  - Cylc understands that multiple nodes can be used to submit work to a single queue.
  - And can distribute the submission workload between them.
  - If multiple nodes are configured and one goes down, Cylc will automatically
    switch to using the others.
  - Allowing for interruption free maintenance and
    support for elastic systems.

* <carbon-direction-loop-right-filled /> Workflow and job lifecycle hooks for integration into higher level
  monitoring and telemetry systems.
  - So you can feed Cylc events into an existing monitoring system.
* <carbon-time /> Simulated vs real time.
  - Cylc workflows can be easily changed between simulated and real time.
  - This makes the job of getting research into production much easier.
  - Because you can use the same workflow configuration for both.
* <carbon-increase-level /> Scaling
  - Demonstrated scaling to:
    - 100s of recurrences,
    - 1'000s of tasks,
    - 10'000 of of dependencies
    Per scheduler instance!
  - Horizontal scaling thanks to decentralised architecture.
  - Batched job submissions help to reduce the load on the batch system.
* Trusted by sites world wide.
  * There's a list of sites on the Cylc website.
  * Let us know if you're using Cylc but not on the list.
-->

---
layout: title
image: /img/metoffice-globe-background.jpg
logo: /img/MO_MASTER_for_dark_backg_RBG.png
---

Case Study
::one::
<carbon-enterprise />
::two::
<carbon-satellite-weather />
::three::
<carbon-sun />
::four::
<carbon-connection-signal />


---
layout: points
---

<v-clicks>

* <carbon-chemistry /> Used for research since 2012
* <carbon-content-delivery-network /> Used for production since 2014

</v-clicks>


<!--

* Used for research since 20??
* Used for production since 20??

-->

---

<img class="mx-auto" width="700" src="/img/mo-research-usage.png" />

<!--

* This graph shows the trend of research usage from 2014 onwards.
* The yellow line is the number of running workflows.
* The blue line is the number of unique user accounts running these workflows.
* These days we usually have around 200 scientists are usually running
  about 800 workflows.
* We use Cylc to distribute those workflows onto a pool of workflow servers.

-->

---
layout: points
---

<v-clicks>

* <carbon-bare-metal-server /> 3 Cray XC40 platforms.
* <carbon-radio-button-checked /> ~10 million job submissions every month.
* <carbon-percentage-filled /> ~99.6% of those are made by Cylc.
* <carbon-rocket /> Next HPC currently being provisioned.

</v-clicks>

<!--

* <carbon-bare-metal-server /> 3 Cray XC40 platforms
  * The bulk of the workload is submitted to 3 HPC platforms.
  * Which represent ~500'000 CPU cores.
* <carbon-radio-button-checked /> ~10 million job submissions every month.
  * These platforms recieve ~10 million job submissions every month.
* <carbon-percentage-filled /> ~99.6% of those are made by Cylc.
* <carbon-rocket /> Next HPC platform is currently being provisioned.
  * Which will initially represent in the order of one million cores.
  * This setup will include hybrid cloud elements.
  * We will be using Cylc to manage the workload on this platform.

// 128 * 200 per node
-->

---
layout: two-cols
---

### Used for a variety of purposes including:

<br />

* Production weather forecasting.
* Climate research.
* Space weather.
* Test frameworks.

::right::

<div>
    <img v-click style="position: absolute;" src="/img/complex-3.png" />
    <img v-click style="position: absolute;" src="/img/complex-2.png" />
    <img v-click style="position: absolute;" src="/img/complex-1.png" />
</div>

<!--

* Cylc is used as a general purpose tool for a variety of purposes.
  * Production weather forecasting.
  * Climate research.
  * Space weather.
  * "Rose Stem" test framework for numerical models.
  * Payslips

* We use Jinja2 and Rose to allow us to configure our workflows and run them
  in different modes.
  * Cylc has built-in support for Jinja2.
  * And support for the Rose configuration system via a plugin.
-->

---
layout: points
---

<div class="text-4xl">Information:</div>

* <carbon-logo-github /> [github.com/cylc](https://github.com/cylc/cylc-flow)
* <carbon-document /> [cylc.org/cylc-doc](https://cylc.github.io/cylc-doc/stable/html/index.html)

<br />

<div class="text-4xl">Community:</div>

* <logos-discourse-icon /> [cylc.discourse.group](https://cylc.discourse.group/)
* <carbon-chat /> [cylc-general:matrix](https://matrix.to/#/#cylc-general:matrix.org)

<img
    style="
        position: fixed;
        top: 10px;
        left: 0;
        z-index: -1;
        opacity: 0.075;
    "
    src="/img/graph-background.png"
/>

<!--

* And that brings us to the end of this quick overview of Cylc.
* ...
* All of the Cylc projects can be found on GitHub.
* ...
* The documentation contains tutorials and a user guide...
* ...but also reference material including architecture diagrams
  if you're interested in finding out more about multi-user setups.
* ...
* The Cylc developers and the wider community can be reached on the Discourse
  forum.
* ...
* And for anyone interested in Cylc development or implementation details
  there's a developer's chat on Element.
* ...
* ...
* Any questions!?!?!?!?
-->
