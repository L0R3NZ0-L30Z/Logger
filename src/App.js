import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [localIp, setLocalIp] = useState("");
  const [inputIp, setInputIp] = useState("");
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    const storedLogs = localStorage.getItem("logs");
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }

    const storedIp = localStorage.getItem("localIp");
    if (storedIp) {
      setLocalIp(storedIp);
      setInputIp(storedIp); 
    }
  }, []);

  useEffect(() => {
    if (localIp) {
      const sseUrl = `http://${localIp}`; 

      const newEventSource = new EventSource(sseUrl);
  
      newEventSource.onopen = () => {
        console.log("Connected to SSE server");
      };
  
      newEventSource.onmessage = (event) => {
        const newLog = event.data;
        handleNewLog(newLog);
      };
  
      newEventSource.onerror = (err) => {
        console.error("SSE error:", err);
        setError("Error connecting to SSE.");
        newEventSource.close(); 
      };
  
      setEventSource(newEventSource);
  
      return () => {
        if (newEventSource) {
          newEventSource.close();
        }
      };
    }
  }, [localIp]);

  const downloadLogs = () => {
    const element = document.createElement("a");
    const file = new Blob([logs.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "logs.txt";
    document.body.appendChild(element);
    element.click();
  };

  const clearLogs = () => {
    setLogs([]);
    setError("");
    localStorage.removeItem("logs");
  };

  const handleIpChange = (e) => {
    setInputIp(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIp();
    }
  };

  const setIp = () => {
    setLocalIp(inputIp);
    setError("");
    setLogs([]);
    localStorage.setItem("localIp", inputIp);
  };

  const handleNewLog = (newLog) => {
    setLogs((prevLogs) => {
      const updatedLogs = [newLog, ...prevLogs];
      localStorage.setItem("logs", JSON.stringify(updatedLogs));
      return updatedLogs;
    });
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
            onKeyDown={handleKeyPress}
          />
          
            <button onClick={setIp} className="set-ip-btn">Set IP</button>
          </div>
          <button onClick={downloadLogs} className="download-btn">
            Download Logs
          </button>
        
      </div>
      {logs.length > 0 || error.length > 0 ? (
        <div className="log-container">
          {error && <div className="error">{error}</div>}
          {logs.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))}
          <button onClick={clearLogs} className="clear-logs-btn"></button>
        </div>
      ) : (
        <div />
      )}
      <div className="footer">
        <p><a href="https://github.com/La-Salle-Florida/Logger-Leguizard" class="custom-link">La Salle Florida Robotics Team</a> - Designed By <a href="https://github.com/L0R3NZ0-L30Z" class="custom-link">Lorenzo Leoz</a></p>
      </div>
    </div>
  );
}

export default App;
