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
      const sseUrl = localIp;

      console.log(sseUrl);

      const newEventSource = new EventSource(sseUrl);

      newEventSource.onmessage = (event) => {
        console.log("Received message:", event.data);

        try {
          const newLog = event.data;
          console.log("Parsed log:", newLog);
          handleNewLog(newLog);
        } catch (error) {
          console.error("Error parsing log:", error);
          console.error("Raw data:", event.data);
        }
      };

      newEventSource.onerror = (err) => {
        console.error("SSE error:", err);
        setError("Error connecting to SSE.");
        newEventSource.close();
      };

      newEventSource.onopen = () => {
        console.log("Connected to SSE server");
        setError("");
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
    console.log(newLog);
    setLogs((prevLogs) => {
      const updatedLogs = [newLog, ...prevLogs];
      localStorage.setItem("logs", JSON.stringify(updatedLogs));
      return updatedLogs;
    });
  };

  return (
    <div className="App">
      
      <h1 className="title">Logs Viewer</h1>
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
          <button onClick={clearLogs} className="clear-logs-btn"></button>

          {error && <div className="error">{error}</div>}
          {logs.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))}
        </div>
      ) : (
        <div />
      )}
      <div className="footer">
        <h3><a href="https://github.com/La-Salle-Florida/Logger-ESP32" className="custom-link">La Salle Florida Robotics Team</a></h3>
        <p>Designed By <a href="https://github.com/L0R3NZ0-L30Z" className="custom-link">Lorenzo Leoz</a></p>
      </div>
    </div>
  );
}

export default App;