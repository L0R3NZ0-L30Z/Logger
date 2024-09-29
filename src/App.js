import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [localIp, setLocalIp] = useState("");
  const [inputIp, setInputIp] = useState("");

  useEffect(() => {
    // Fetch logs when localIp is set
    if (localIp) {
      fetchLogs();
    }
  }, [localIp]);

  const fetchLogs = async () => {
    try {
      const mockData = "●";
      setLogs((prevLogs) => [...prevLogs, mockData]);
      localStorage.setItem("logs", JSON.stringify([...logs, mockData]));
    } catch (err) {
      setError("Error fetching logs: " + err.message);
    }
  };

  const downloadLogs = () => {
    const element = document.createElement("a");
    const file = new Blob([logs.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "logs.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleIpChange = (e) => {
    setInputIp(e.target.value);
  };

  const setIp = () => {
    setLocalIp(inputIp);
    setError("");
    setLogs([]);
  };

  return (
    <div className="App">
      <h1>Logs Viewer</h1>
      <div id="bar">
        <div className="input-section">
          <input
            type="text"
            placeholder="Enter Local IP"
            value={inputIp}
            onChange={handleIpChange}
          />
          <button onClick={setIp} className="set-ip-btn">Set IP</button>
        </div>

        
        <button onClick={downloadLogs} className="download-btn">
          Download Logs
        </button>
      </div>
      <div className="log-container">
        {error && <div className="error">{error}</div>}
        {logs.map((log, index) => (
          <div key={index} className="log-entry">
            {log}
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;