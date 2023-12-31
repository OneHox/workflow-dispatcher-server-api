const Joi = require("joi");
const axios = require("axios");
const express = require("express");
const { TinyDB } = require('./tinydb');
const { rateLimit } = require('express-rate-limit');
const validator = require("express-joi-validation").createValidator({});

const db = new TinyDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// store: ... , // Use an external store for more precise rate limiting
});

app.use(limiter);

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

  db.insert(group, JSON.stringify({ workflow_run, workflowRef, workflowId, token, watches, createdAt: Date.now() }));
  res.json({ message: "Manifest has been created" });
});

app.post("/vote", validator.body(Joi.object({
  group: Joi.string().required(),
  workflow: Joi.string().required(),
  finished: Joi.string().required(),
})), async (req, res) => {
  const { group, workflow, finished } = req.body;
  let manifest = await db.retrieve(group);
  if (!manifest) return res.json({ message: "create a manifest first" });

  manifest = JSON.parse(manifest);
  manifest['watches'] = manifest['watches'].map(e => {
    if (e['key'] == workflow) e['value'] = (finished == 'true');
    return e;
  });
  db.insert(group, JSON.stringify(manifest));

  const failed_any = manifest['watches'].some(e => e['value'] == false);
  if (!failed_any) {
    const hit = manifest['workflow_run'];    
    const payload = {
      "ref": manifest['workflowRef'],
      "inputs": {
        "message": "all workflow passed"
      }
    };
    const headers = {
      "Authorization": `Bearer ${manifest['token']}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json",
    };

    try { 
      await axios.post(hit, payload, { headers });
    } catch(err) { console.error(err.message); };

    db.delete(group);
  }

  res.json({ message: `Voted: ${workflow}` });
});

app.get("/", (req, res) => {
  res.json({
    owner: "https://github.com/OneHox/workflow-dispatcher-server-api",
  });
});

let PORT = process.env.PORT || 3000;
(async function () {
  app.listen(PORT, async () => console.log(`App is running on port ${PORT}`));
})();

module.exports = app;
