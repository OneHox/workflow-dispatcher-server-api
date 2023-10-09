# workflow-dispatcher-server-api

Build for workflow-dispatch action. That's it

This service is running with

1.  Cyclic
3.  Express
2.  Redis Cloud

### How does it work

Your Workflow -> workflow-dispatcher -> [this app running on cyclic] -> redis


##### IMPORTANT

We are exposing the redis sensitive info here. this is useless for you because this service is in free tier and just created for keeping a very short living data


## Job of this app

Fire workflow dispatch run on your repository if all the specfied workflow has completed

### Reason

Because `workflow_run` is useless for us

### Anger

Fuck github actions `workflow_run`. i spent 12 hours to build this complete shit for keeping the workflow status and redirecting the result back to github workflow. 