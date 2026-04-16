# 🌌 CCS-AI — Celestial Control System (AI-Powered)
<img width="1920" height="868" alt="Screenshot 2026-04-16 084246" src="https://github.com/user-attachments/assets/11d3f388-7f06-4532-b9a9-9c0f7bad4539" />
<img width="1918" height="872" alt="Screenshot 2026-04-16 084341" src="https://github.com/user-attachments/assets/a4ddfcfa-485e-45bf-a433-969b73d4c329" />
<img width="1920" height="869" alt="Screenshot 2026-04-16 084451" src="https://github.com/user-attachments/assets/60fc3d19-e5dd-47a6-b144-eea02c7ba123" />

> A production-grade, AI-driven real-time system visualization platform that combines distributed simulation, predictive analytics, and immersive 3D rendering.

---

## 🚀 Overview

**CCS-AI (Celestial Control System)** is an advanced system engineering platform designed to simulate, analyze, and visualize complex distributed systems in real time.

The platform integrates:

* **High-frequency simulation engines**
* **Machine learning-based anomaly detection**
* **Predictive failure modeling**
* **Immersive 3D visualization using WebGL**

It transforms system telemetry into a **celestial environment**, where nodes behave like stars, data flows as energy streams, and failures manifest as cosmic disturbances.

---

## 🧠 Core Concept

CCS-AI reimagines system monitoring by mapping engineering concepts to a visual paradigm:

| System Concept     | Celestial Representation   |
| ------------------ | -------------------------- |
| Nodes              | Stars / Planets            |
| Data Flow          | Energy Streams             |
| System Load        | Luminosity                 |
| Anomalies          | Distortions / Flicker      |
| Failure Prediction | Halo / Orbital Instability |

This approach enhances both **intuition and observability** in complex systems.

---

## 🏗️ Architecture

```text
[Simulation Engine] 
        ↓
[Node.js Real-Time Server]
        ↓
[Python AI Engine]
        ↓
[WebSocket Streaming Layer]
        ↓
[React + Three.js 3D Visualization]
```

---

## ⚙️ System Components

### 🔹 1. Simulation Engine (Node.js)

* Generates real-time telemetry:

  * Load (%)
  * Latency (ms)
  * Error rate
  * Throughput
* Supports:

  * Dynamic node creation
  * Cascading failure simulation
  * Configurable behavior (via JSON)

---

### 🔹 2. AI / ML Engine (Python)

#### Anomaly Detection

* Isolation Forest model
* Detects:

  * Spikes
  * Drift
  * Irregular patterns

#### Predictive Modeling

* Trend-based prediction (short-term forecasting)
* Outputs:

  * Failure probability
  * Predicted system state

Example output:

```json
{
  "node_id": "N1",
  "status": "CRITICAL",
  "failure_probability": 0.87,
  "prediction_window": "5s"
}
```

---

### 🔹 3. Real-Time Integration Layer

* Node.js ↔ Python communication via stdin/stdout
* Low-latency event streaming
* WebSocket (Socket.IO) broadcasting

---

### 🔹 4. 3D Visualization Engine (React + Three.js)

* WebGL-powered rendering
* Features:

  * Glowing celestial nodes
  * Particle-based data flows
  * Post-processing effects (Bloom, Noise, Vignette)
  * Smooth animations

#### Visual States:

* **Normal:** Stable glow
* **Warning:** Pulsing light
* **Critical:** Distortion + flicker
* **Predicted Failure:** Halo effect

---

### 🔹 5. HUD & Control System

* Global Stability Index
* Real-time system metrics
* Event log console
* Interactive controls:

  * Inject anomaly
  * Reset simulation
  * Adjust system load

---

## 🔥 Key Features

### ✅ Real-Time Distributed Simulation

* Multi-node system with dynamic interactions
* Cascading failure propagation

---

### 🤖 AI-Powered Intelligence

* Live anomaly detection
* Predictive failure modeling
* Confidence-based classification

---

### 🌌 Immersive 3D Interface

* Celestial-themed visualization
* High-performance rendering
* Intuitive system interpretation

---

### ⚡ Event-Driven Architecture

* WebSocket-based real-time updates
* Low-latency communication pipeline

---

### 📊 System Stability Index

* Aggregated health metric across all nodes
* Real-time updates

---

### 🔁 Replay & Observability (Extensible)

* Event logging for diagnostics
* Replay-ready architecture

---

## 🛠️ Tech Stack

| Layer         | Technology                           |
| ------------- | ------------------------------------ |
| Frontend      | React, Three.js, WebGL, Tailwind CSS |
| Backend       | Node.js, Express, Socket.IO          |
| AI/ML         | Python, scikit-learn, NumPy          |
| Communication | WebSockets, stdin/stdout             |
| Data Format   | JSON                                 |
| Config        | JSON-based                           |

---

## 📁 Project Structure

```
ccs-ai/
│
├── backend/
│   ├── simulation_engine.ts
│   └── server.ts
│
├── ai_engine/
│   ├── anomaly_detection.py
│   └── prediction_model.py
│
├── frontend/
│   ├── components/
│   ├── three_scene/
│   └── App.tsx
│
├── config/
│   └── config.json
│
├── logs/
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/jiten54/CCS-AI-Celestial-Control-System
cd CCS-AI-Celestial-Control-System
```

---

### 2. Install Dependencies

#### Backend

```bash
npm install
```

#### AI Engine

```bash
pip install -r requirements.txt
```

---

### 3. Run the System

#### Start Backend

```bash
npm run dev
```

#### Start AI Engine

```bash
python ai_engine/anomaly_detection.py
```

#### Start Frontend

```bash
npm run start
```

---

## 🎯 Use Cases

* Distributed system monitoring
* Real-time anomaly detection
* Predictive system analytics
* Data visualization research
* Engineering dashboards for complex systems

---

## 🚀 Benefits

* Demonstrates **advanced system design + AI integration**
* Combines **low-latency streaming with predictive analytics**
* Showcases **multi-language architecture**
* Provides a **highly unique visualization paradigm**
* Strong alignment with **industrial and scientific systems**

---

## 🧠 Engineering Principles

* Event-driven architecture
* Real-time data processing
* Fault tolerance & resilience
* Predictive analytics
* Modular system design
* Observability & diagnostics

---

## 🔮 Future Enhancements

* Deep Learning (LSTM-based forecasting)
* Kubernetes deployment
* Distributed multi-node clustering
* Database integration (time-series DB)
* OPC-UA integration bridge

---

## 👤 Author

**Jiten Moni Das**

* GitHub: https://github.com/jiten54
* LinkedIn: https://www.linkedin.com/in/jiten-moni-das-01b3a032b

---

## 🌍 Inspiration

This project is inspired by real-world system monitoring challenges in large-scale environments such as CERN, where reliability, real-time analysis, and system integration are critical.

---

## ⭐ Final Note

CCS-AI is not just a visualization tool — it is a **system intelligence platform**, merging engineering, artificial intelligence, and immersive design into a unified experience.
