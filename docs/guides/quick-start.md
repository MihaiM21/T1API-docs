# Quick Start Tutorial

Build your first Formula One telemetry application in 10 minutes! This tutorial will guide you through creating a simple dashboard that displays live race data.

## What We'll Build

A real-time F1 telemetry dashboard showing:
- Current driver positions
- Live speed and gear data
- Lap times and sector splits
- DRS status and tire information

## Step 1: Set Up Your Project

### JavaScript/Node.js

```bash
# Create a new project
mkdir f1-dashboard
cd f1-dashboard
npm init -y

# Install dependencies
npm install express dotenv node-fetch ws
```

Create a `.env` file:

```bash
T1API_KEY=your_api_key_here
PORT=3000
```

### Python

```bash
# Create a new project
mkdir f1-dashboard
cd f1-dashboard
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install requests python-dotenv websockets flask
```

Create a `.env` file:

```bash
T1API_KEY=your_api_key_here
PORT=5000
```

## Step 2: Fetch Current Session Data

### JavaScript

Create `app.js`:

```javascript
require('dotenv').config();
const fetch = require('node-fetch');

const API_KEY = process.env.T1API_KEY;
const BASE_URL = 'https://api.t1f1.com/v1';

async function getCurrentSession() {
  const response = await fetch(`${BASE_URL}/sessions/current`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  const session = await response.json();
  console.log('Current Session:', session);
  return session;
}

getCurrentSession().catch(console.error);
```

### Python

Create `app.py`:

```python
import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('T1API_KEY')
BASE_URL = 'https://api.t1f1.com/v1'

def get_current_session():
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(f'{BASE_URL}/sessions/current', headers=headers)
    response.raise_for_status()
    
    session = response.json()
    print('Current Session:', session)
    return session

if __name__ == '__main__':
    get_current_session()
```

## Step 3: Get Driver Standings

### JavaScript

Add to `app.js`:

```javascript
async function getDriverStandings() {
  const response = await fetch(`${BASE_URL}/drivers/standings`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  const standings = await response.json();
  
  console.log('\nDriver Standings:');
  standings.drivers.forEach(driver => {
    console.log(`${driver.position}. ${driver.name} - ${driver.points} pts`);
  });
  
  return standings;
}
```

### Python

Add to `app.py`:

```python
def get_driver_standings():
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(f'{BASE_URL}/drivers/standings', headers=headers)
    response.raise_for_status()
    
    standings = response.json()
    
    print('\nDriver Standings:')
    for driver in standings['drivers']:
        print(f"{driver['position']}. {driver['name']} - {driver['points']} pts")
    
    return standings
```

## Step 4: Stream Live Telemetry

### JavaScript

Add WebSocket connection:

```javascript
const WebSocket = require('ws');

function streamLiveTelemetry() {
  const ws = new WebSocket(
    `wss://stream.t1f1.com/v1/telemetry?key=${API_KEY}`
  );
  
  ws.on('open', () => {
    console.log('\n🔴 Connected to live telemetry stream');
  });
  
  ws.on('message', (data) => {
    const telemetry = JSON.parse(data);
    console.log(`
      Driver: ${telemetry.driver}
      Speed: ${telemetry.speed} km/h
      Gear: ${telemetry.gear}
      Throttle: ${telemetry.throttle}%
      Brake: ${telemetry.brake}%
      DRS: ${telemetry.drs ? '✅' : '❌'}
    `);
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  
  ws.on('close', () => {
    console.log('Disconnected from telemetry stream');
  });
}

// streamLiveTelemetry();
```

### Python

Add WebSocket connection:

```python
import asyncio
import websockets
import json

async def stream_live_telemetry():
    uri = f'wss://stream.t1f1.com/v1/telemetry?key={API_KEY}'
    
    async with websockets.connect(uri) as websocket:
        print('\n🔴 Connected to live telemetry stream')
        
        async for message in websocket:
            telemetry = json.loads(message)
            print(f"""
              Driver: {telemetry['driver']}
              Speed: {telemetry['speed']} km/h
              Gear: {telemetry['gear']}
              Throttle: {telemetry['throttle']}%
              Brake: {telemetry['brake']}%
              DRS: {'✅' if telemetry['drs'] else '❌'}
            """)

# Run with:
# asyncio.run(stream_live_telemetry())
```

## Step 5: Build a Simple Dashboard

### HTML Dashboard

Create `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>F1 Telemetry Dashboard</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      background: #0f0f14;
      color: #fff;
      padding: 2rem;
    }
    
    .header {
      background: linear-gradient(135deg, #e10600 0%, #8b0400 100%);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      opacity: 0.9;
      font-size: 1.2rem;
    }
    
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .card {
      background: #15151e;
      border: 1px solid #2a2a35;
      border-radius: 12px;
      padding: 1.5rem;
      transition: transform 0.2s;
    }
    
    .card:hover {
      transform: translateY(-4px);
      border-color: #e10600;
    }
    
    .card-title {
      color: #e10600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1rem;
    }
    
    .card-value {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .card-label {
      color: #8a8a8f;
      font-size: 0.9rem;
    }
    
    .status-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    .status-live {
      background: #00d976;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏎️ F1 Telemetry Dashboard</h1>
    <p class="subtitle">
      <span class="status-indicator status-live"></span>
      Live Session Data
    </p>
  </div>
  
  <div class="dashboard">
    <div class="card">
      <div class="card-title">Speed</div>
      <div class="card-value" id="speed">--</div>
      <div class="card-label">km/h</div>
    </div>
    
    <div class="card">
      <div class="card-title">Gear</div>
      <div class="card-value" id="gear">--</div>
      <div class="card-label">Current Gear</div>
    </div>
    
    <div class="card">
      <div class="card-title">Throttle</div>
      <div class="card-value" id="throttle">--</div>
      <div class="card-label">Percentage</div>
    </div>
    
    <div class="card">
      <div class="card-title">DRS</div>
      <div class="card-value" id="drs">--</div>
      <div class="card-label">Status</div>
    </div>
  </div>
  
  <script>
    // Connect to WebSocket
    const API_KEY = 'your_api_key_here';
    const ws = new WebSocket(`wss://stream.t1f1.com/v1/telemetry?key=${API_KEY}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      document.getElementById('speed').textContent = data.speed;
      document.getElementById('gear').textContent = data.gear;
      document.getElementById('throttle').textContent = data.throttle + '%';
      document.getElementById('drs').textContent = data.drs ? '✅ Active' : '❌ Inactive';
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  </script>
</body>
</html>
```

## Step 6: Run Your Application

### JavaScript

```bash
node app.js
```

Then open `public/index.html` in your browser.

### Python

```bash
python app.py
```

## Complete Example

Here's the complete working example combining all steps:

```javascript
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const WebSocket = require('ws');

const app = express();
const API_KEY = process.env.T1API_KEY;
const BASE_URL = 'https://api.t1f1.com/v1';
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// API endpoints
app.get('/api/session', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/sessions/current`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/standings', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/drivers/standings`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🏎️  F1 Dashboard running on http://localhost:${PORT}`);
});
```

## Next Steps

Congratulations! You've built your first F1 telemetry application. Here's what to explore next:

- 📊 [Lap Data Analysis](/docs/api/lap-data) - Analyze lap times and sectors
- 🌤️ [Weather Data](/docs/api/weather) - Access track weather conditions
- 📈 [Historical Data](/docs/guides/historical-data) - Query past race data
- 🎯 [Best Practices](/docs/guides/best-practices) - Optimize your application

## Troubleshooting

### Connection Issues

```javascript
// Add retry logic
function connectWithRetry(url, maxRetries = 5) {
  let retries = 0;
  
  function connect() {
    const ws = new WebSocket(url);
    
    ws.on('error', () => {
      if (retries < maxRetries) {
        retries++;
        console.log(`Retrying... (${retries}/${maxRetries})`);
        setTimeout(connect, 2000 * retries);
      }
    });
    
    return ws;
  }
  
  return connect();
}
```

### Rate Limiting

If you hit rate limits, implement exponential backoff:

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

## Support

Need help? We're here for you:

- 📧 [contact@t1f1.com](mailto:contact@t1f1.com)
- 💬 [Discord Community](https://discord.gg/turnone)
- 📚 [Full API Documentation](/docs/api/overview)
