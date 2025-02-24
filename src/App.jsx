import { useState } from "react";
import "./App.css";
import LZ from "./components/LZ"; 

function App() {
  const [service_account_key, set_service_account_key] = useState("");
  const [saKey_authenticated, set_saKey_authenticated] = useState(false);

  const validateKey = () => {
    /// logic to validate the key

    set_saKey_authenticated(true);
  };

  return (
    <>
      {saKey_authenticated ? (
        <div>
          <p>Authentication: ✅</p>
          <LZ />
        </div>
      ) : (
        <div className="auth-container">
          <h2>Enter Service Account Key</h2>
          <input
            type="text"
            placeholder="Enter Key"
            value={service_account_key}
            onChange={(e) => set_service_account_key(e.target.value)}
          />
          <button onClick={validateKey}>Validate</button>
        </div>
      )}
    </>
  );
}

export default App;

