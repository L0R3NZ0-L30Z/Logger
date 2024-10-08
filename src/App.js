import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [localIp, setLocalIp] = useState("");
  const [inputIp, setInputIp] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Load logs from localStorage
    const storedLogs = localStorage.getItem("logs");
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }

    // Load IP address from localStorage
    const storedIp = localStorage.getItem("localIp");
    if (storedIp) {
      setLocalIp(storedIp);
      setInputIp(storedIp); // Set the input field to the stored IP
    }
  }, []);

  useEffect(() => {
    if (localIp) {
      const newSocket = new WebSocket(localIp);

      newSocket.onopen = () => {
        console.log("Connected to WebSocket");
      };

      newSocket.onmessage = (event) => {
        const newLog = event.data;
        handleNewLog(newLog);
      };

      newSocket.onerror = (err) => {
        console.error("WebSocket error:", err);
        setError("Error connecting to WebSocket.");
      };

      newSocket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      setSocket(newSocket);

      return () => {
        if (newSocket.readyState === WebSocket.OPEN) {
          newSocket.close();
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
    localStorage.setItem("localIp", inputIp); // Store the IP address in localStorage
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
        <p>La Salle Florida Robotics Team - Designed By Leoz</p>
      </div>
    </div>
  );
}

export default App;
