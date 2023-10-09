const Joi = require("joi");
const axios = require("axios");
const express = require("express");
const { JSONFileManager } = require("./utils/json-file-manager");
const validator = require("express-joi-validation").createValidator({});

const app = express();
app.use(express.json());

const file_name = "data.json";
const jsonFileManager = new JSONFileManager(file_name);

app.post("/manifest", validator.body(Joi.object({
  group: Joi.string().required(),
  watch: Joi.string().required(),
  token: Joi.string().required(),
  repository: Joi.string().required(),
  workflowId: Joi.string().required(),
  workflowRef: Joi.string().required(),
})), async (req, res) => {
  const { group, watch, token, repository, workflowId, workflowRef } = req.body;
  const watches = watch.split(",").map(e => { return { key: e.trim(), value: false }});
  const workflow_run = `https://api.github.com/repos/${repository}/actions/workflows/${workflowId}/dispatches`;
  const register = jsonFileManager.read();

  if (register) {
    register[group] = { workflow_run, workflowRef, workflowId, token, watches, createdAt: Date.now() };
    jsonFileManager.write(register);
    res.json({ message: "Manifest has been created" });
  } else {
    res.json({ message: "Already registered" });
  }
});

app.post("/vote", validator.body(Joi.object({
  group: Joi.string().required(),
  token: Joi.string().required(),
  workflow: Joi.string().required(),
  finished: Joi.string().required(),
})), async (req, res) => {
  const { group, token, workflow, finished } = req.body;
  const register = jsonFileManager.read();

  const manifest = register[group];
  if (!manifest) return res.json({ message: "create a manifest in the first place" });
  manifest['watches'] = manifest['watches'].map(e => {
    if (e['key'] == workflow) e['value'] = (finished == 'true');
    return e;
  });

  register[group] = manifest;
  jsonFileManager.update(register);

  const not_passed = manifest['watches'].some(e => e['value'] == false);
  if (!not_passed) {
    const hit = manifest['workflow_run'];    
    const payload = {
      "ref": manifest['workflowRef'],
      "inputs": {
        "message": "all workflow passed"
      }
    };
    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
    };

    try { 
      await axios.post(hit, payload, { headers });
    } catch(err) { console.error(err.message); };

    delete register[group];
    jsonFileManager.update(register);
  }

  res.json({ message: `Voted: ${workflow}` });
});

app.get("/", (req, res) => {
  res.json({
    owner: "https://github.com/OneHox/workflow-dispatcher-server-api",
  });
});

let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

module.exports = app;
