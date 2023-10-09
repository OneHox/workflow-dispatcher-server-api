const axios = require("axios");

// Replace these placeholders with your actual values
const username = "OneHox";
const repository = "workflows";
const workflowId = "blank.yml";
const pat = "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";

async function triggerWorkflow() {
  try {
    // Construct the GitHub API URL for triggering the workflow
    const apiUrl = `https://api.github.com/repos/${username}/${repository}/actions/workflows/${workflowId}/dispatches`;

    // Create a JSON payload for the workflow input parameters (if needed)
    // In this example, we're not passing any input parameters
    const payload = {
      "ref": "main",
      "inputs": {
        "comment": "pussy fuck"
      }
    };

    // Define the HTTP headers
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${pat}`,
      Accept: "application/vnd.github.v3+json",
    };

    // Make an HTTP POST request to trigger the workflow
    const response = await axios.post(apiUrl, payload, { headers });

    // Check if the request was successful (status code 204)
    if (response.status === 204) {
      console.log("Workflow triggered successfully!");
    } else {
      console.error(
        `Failed to trigger workflow. Status code: ${response.status}`
      );
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

// Invoke the function to trigger the workflow
triggerWorkflow();
