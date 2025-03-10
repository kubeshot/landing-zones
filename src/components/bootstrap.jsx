import React, { useState } from "react";
import "../styles/bootstrap.css";

const Bootstrap = () => {
  const [githubAccessToken, setGithubAccessToken] = useState("");
  const [githubAccessTokenForBackend,setGithubAccessTokenForBackend]= useState("");
  const [errors, setErrors] = useState({});
  const [updates, setUpdates] = useState([]);

  const [formData, setFormData] = useState({
    orgId: "",
    billingAccount: "",
    billingProject: "",
    emailDomain: "",
    parentFolderID: "",
    gitOrgName: "",
    bootstrapRepo: "",
    organizationRepo: "",
    environmentsRepo: "",
    networksRepo: "",
    projectsRepo: "",
  });

  const fields = [
    {
      label: "Organization ID",
      name: "orgId",
      placeholdertext: "000000000000",
      description: "Unique Organization ID of your organization in GCP",
      pattern: /^\d+$/,
      errorMsg: "Org ID must be digits only.",
    },
    {
      label: "Billing Account",
      name: "billingAccount",
      placeholdertext: "XXXXXX-XXXXXX-XXXXXX",
      description: "Billing account number in format XXXXXX-XXXXXX-XXXXXX",
      pattern: /^[A-Z0-9]{6}-[A-Z0-9]{6}-[A-Z0-9]{6}$/,
      errorMsg: "Billing Account must be in the format XXXXXX-XXXXXX-XXXXXX (uppercase letters, numbers, and dashes).",
    },
    {
      label: "Billing Project ID",
      name: "billingProject",
      placeholdertext: "my-first-project",
      description: "Project ID where you want to create groups",
      required: true,
      errorMsg: "Billing Project ID is required.",
    },
    {
      label: "Email Domain",
      name: "emailDomain",
      placeholdertext: "example.com",
      description: "Email domain for your groups. Do not include @",
      pattern: /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      errorMsg: "Enter a valid domain (example.com, google.org, etc.), do not include '@'.",
    },
    {
      label: "Parent Folder ID",
      name: "parentFolderID",
      placeholdertext: "000000000000",
      description: "Folder where you want to create required folders and projects",
      pattern: /^\d+$/,
      errorMsg: "Parent Folder ID must be digits only.",
    },
    {
      label: "GitHub Organization Name",
      name: "gitOrgName",
      placeholdertext: "myorg",
      description: "Name of the organization in GitHub",
      pattern: /^[a-zA-Z0-9-]+$/,
      errorMsg: "GitHub Org Name should contain only letters, numbers, and hyphens.",
    },
    {
      label: "Bootstrap Repository Name",
      name: "bootstrapRepo",
      placeholdertext: "gcp-bootstrap",
      description: "Repository name in GitHub (not the full URL)",
      pattern: /^[a-zA-Z0-9-_]+$/,
      errorMsg: "Repo name should contain only letters, numbers, and hyphens.",
    },
    {
      label: "Organization Repository Name",
      name: "organizationRepo",
      placeholdertext: "gcp-organization",
      description: "Repository name in GitHub (not the full URL)",
      pattern: /^[a-zA-Z0-9-_]+$/,
      errorMsg: "Repo name should contain only letters, numbers, and hyphens.",
    },
    {
      label: "Environments Repository Name",
      name: "environmentsRepo",
      placeholdertext: "gcp-environments",
      description: "Repository name in GitHub (not the full URL)",
      pattern: /^[a-zA-Z0-9-_]+$/,
      errorMsg: "Repo name should contain only letters, numbers, and hyphens.",
    },
    {
      label: "Networks Repository Name",
      name: "networksRepo",
      placeholdertext: "gcp-networks",
      description: "Repository name in GitHub (not the full URL)",
      pattern: /^[a-zA-Z0-9-_]+$/,
      errorMsg: "Repo name should contain only letters, numbers, and hyphens.",
    },
    {
      label: "Projects Repository Name",
      name: "projectsRepo",
      placeholdertext: "gcp-projects",
      description: "Repository name in GitHub (not the full URL)",
      pattern: /^[a-zA-Z0-9-_]+$/,
      errorMsg: "Repo name should contain only letters, numbers, and hyphens.",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleTokenChange = (e) => {
    setGithubAccessToken(e.target.value);
  };
  const handleTokenChangeForBackend = (e)=>{
    setGithubAccessTokenForBackend(e.target.value);
  }

  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = field.errorMsg || "This field is required.";
        valid = false;
      }
      if (field.pattern && !field.pattern.test(formData[field.name])) {
        newErrors[field.name] = field.errorMsg;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form contains errors.");
      return;
    }

    const payload = {
      ...formData, 
      githubAccessToken,
      githubAccessTokenForBackend 
    };

    const eventSource = new EventSource(`http://localhost:5001/bootstrap-stream`);

    eventSource.onmessage = function (event) {
      console.log("Update:", event.data);
      setUpdates(() => [event.data]);

      if (event.data.includes("Process completed successfully!")) {
        eventSource.close();
      }
    };

    eventSource.onerror = function (event) {
      console.error("EventSource failed:", event);
      eventSource.close();
    };

    try {
      const response = await fetch('http://localhost:5001/bootstrap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify(payload),
      });
    
      const data = await response.json().catch(() => null); 
    
      if (!response.ok) {
        const errorMessage = data?.message || `Error ${response.status}: ${response.statusText}`;
        console.error("Failed to start the process:", errorMessage);
        console.log(`Error: ${errorMessage}`);
      } else {
        console.log('Process started successfully:', data.message);
        console.log(`Success: ${data.message}`);
      }
    } catch (err) {
      console.error("Request failed:", err.message);
      console.log(`Request failed: ${err.message}`);
    }
  };

  const callDownloadplan = async () => {
    try {
      const response = await fetch('http://localhost:5001/bootstrap/downloadplan', {
        method: 'GET',
      });
  
      if (response.ok) {
        const blob = await response.blob();
  
        const url = window.URL.createObjectURL(blob);
  
        const a = document.createElement('a');
        a.href = url;
  
        a.download = 'bootstrap_plan.json'; 
  
        document.body.appendChild(a);
  
        a.click();
  
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
  
        console.log('Download initiated');
      } else {
        console.error('Failed to call the API');
      }
    } catch (error) {
      console.error('Error calling the API:', error);
    }
  };

  const callDestroyBootstrap = async (e)=>{
    e.preventDefault();

    const payload = {
      ...formData, 
      githubAccessToken,
      githubAccessTokenForBackend 
    };

    const eventSource = new EventSource(`http://localhost:5001/bootstrap-stream`);

    eventSource.onmessage = function (event) {
      console.log("Update:", event.data);
      setUpdates(() => [event.data]);

      if (event.data.includes("Process completed successfully!")) {
        eventSource.close();
      }
    };

    eventSource.onerror = function (event) {
      console.error("EventSource failed:", event);
      eventSource.close();
    }
    try {
      const response = await fetch("http://localhost:5001/bootstrap/destroy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const errorMessage = data?.message || `Error ${response.status}: ${response.statusText}`;
        console.error("Failed to start the process:", errorMessage);
        console.log(`Error: ${errorMessage}`);
      } else {
        console.log('Process started successfully:', data.message);
        console.log(`Success: ${data.message}`);
      }
    } catch (err) {
      console.error("Request failed:", err.message);
    }
  }

  const applyBootstrapPlan = async () => {
    try {
      const response = await fetch("http://localhost:5001/bootstrap/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        const errorMessage = data?.message || `Error ${response.status}: ${response.statusText}`;
        console.error("Failed to start the process:", errorMessage);
        console.log(`Error: ${errorMessage}`);
      } else {
        console.log('Process started successfully:', data.message);
        console.log(`Success: ${data.message}`);
      }
    } catch (err) {
      console.error("Request failed:", err.message);
    }
  };

  return (
    <div className="bootstrap-container">
      <strong>Step 1: Bootstrap</strong>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name}>
            <label>
              <div className="containerHeading">
                {field.label}
                <span className="tooltip">
                  <i className="material-icons tooltip-icon">info</i>
                  {field.description && <span className="tooltip-text">{field.description}</span>}
                </span>
              </div>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholdertext}
              />
              {errors[field.name] && <p className="error-message">Error: {errors[field.name]}</p>}
            </label>
          </div>
        ))}

        <div>
          <label>
            <div className="containerHeading">
              GitHub Access Token 1
              <span className="tooltip">
                <i className="material-icons tooltip-icon">info</i>
                <span className="tooltip-text">A fine-grained token with access to all above Repositories and with following Permissions: Actions: Read and Write
                            ,Metadata: Read-only
                            ,Secrets: Read and Write
                            ,Variables: Read and Write
                            ,Workflows: Read and Write</span>
              </span>
            </div>
            <input type="text" value={githubAccessToken} onChange={handleTokenChange} required />
          </label>
          <label>
            <div className="containerHeading">
              GitHub Access Token 2
              <span className="tooltip">
                <i className="material-icons tooltip-icon">info</i>
                <span className="tooltip-text">A fine-grained token with access to all above Repositories and with following Permissions: Actions: Read only
                            ,Metadata: Read-only
                            ,Contents: Read and Write
                            ,Pull Requests: Read and Write</span>
              </span>
            </div>
            <input type="text" value={githubAccessTokenForBackend} onChange={handleTokenChangeForBackend} required />
          </label>
        </div>

        <div id="updates">
            <h3>Updates:</h3>
            {updates.map((update, index) => (
              <div key={index}>
                <p>{update}</p>
                {update === "Plan has been generated" && (
                  <div>
                    <p>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          callDownloadplan();
                        }}
                      >
                        Click here to download
                      </a>
                    </p>
                    <div >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('applying the plan')
                          applyBootstrapPlan();
                        }}
                      >
                        Apply Plan
                      </button>
                      <button
                        onClick={() => {
                          console.log('plan canceled');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        <button type="submit">Submit</button>
        <button onClick={(e)=>callDestroyBootstrap(e)}> Destroy Infrastructure</button>
      </form>
    </div>
  );
};

export default Bootstrap;