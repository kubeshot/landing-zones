import { useState } from "react";
import "./App.css";
import LZ from "./components/LZ";

function App() {
  const [service_account_key, set_service_account_key] = useState(null);
  const [saKey_authenticated, set_saKey_authenticated] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      set_service_account_key(file);
      setUploadMessage(`File uploaded: ${file.name}`);
    }
  };

  const validateKey = () => {
    // Logic to send file to backend for validation 
    set_saKey_authenticated(true);
  };

  return (
    <>
      {saKey_authenticated ? (
        <>
          <div className="auth-success-container">
            <i className="material-icons tooltip-icon">check_circle</i> Authentication Successful
          </div>
          <div>
            <LZ />
          </div>
        </>
      ) : (
        <div className="auth-container">
          <h2>Upload Service Account Key</h2>
            <input type="file" accept=".json" onChange={handleFileUpload} />
            {uploadMessage && <div className="upload-message">{uploadMessage}</div>}
            <button onClick={validateKey} disabled={!service_account_key}>
              Validate
            </button>
          <p>
            This account should have the following roles assigned:
            <br /> 1. roles/resourcemanager.organizationAdmin
            <br /> 2. roles/orgpolicy.policyAdmin
            <br /> 3. roles/resourcemanager.projectCreator
            <br /> 4. roles/billing.admin
            <br /> 5. roles/resourcemanager.folderCreator
          </p>
        </div>
      )}
    </>
  );
}

export default App;
