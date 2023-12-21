# workflow-dispatcher-server-api

Build for workflow-dispatch action. That's it

This service is running with

1.  Sliplane
2.  Express

### How does it work

Your Workflow -> workflow-dispatcher -> [this app running on sliplane]

## Job of this app

Fire workflow dispatch run on your repository if all the specfied workflow has completed

### Reason

Because `workflow_run` is useless for us

### Anger

Fuck github actions `workflow_run`. i spent 12 hours to build this complete shit for keeping the workflow status and redirecting the result back to github workflow. 