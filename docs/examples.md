# Code Examples

Practical examples and code snippets to help you get started with T1API.

## Real-Time Telemetry Dashboard

A complete example of building a real-time F1 telemetry dashboard.

### Backend (Node.js/Express)

```javascript
const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');
require('dotenv').config();

const app = express();
const API_KEY = process.env.T1API_KEY;

app.use(cors());
app.use(express.json());

// REST API endpoints
app.get('/api/session/current', async (req, res) => {
  const response = await fetch('https://api.t1f1.com/v1/sessions/current', {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  const data = await response.json();
  res.json(data);
});

app.get('/api/drivers', async (req, res) => {
  const response = await fetch('https://api.t1f1.com/v1/drivers', {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  const data = await response.json();
  res.json(data);
});

// WebSocket proxy
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (clientWs) => {
  // Connect to T1API stream
  const t1ws = new WebSocket(`wss://stream.t1f1.com/v1/telemetry?key=${API_KEY}`);
  
  t1ws.on('open', () => {
    console.log('Connected to T1API stream');
    t1ws.send(JSON.stringify({
      action: 'subscribe',
      drivers: '*'
    }));
  });
  
  t1ws.on('message', (data) => {
    // Forward to client
    clientWs.send(data);
  });
  
  clientWs.on('close', () => {
    t1ws.close();
  });
});

const server = app.listen(3000, () => {
  console.log('Server running on port 3000');
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
```

### Frontend (React)

```typescript
import React, { useEffect, useState } from 'react';

interface TelemetryData {
  driver: string;
  speed: number;
  gear: number;
  throttle: number;
  brake: number;
  position: number;
}

export function TelemetryDashboard() {
  const [telemetry, setTelemetry] = useState<Record<string, TelemetryData>>({});
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3000');
    
    websocket.onopen = () => {
      console.log('Connected to telemetry stream');
    };
    
    websocket.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setTelemetry(prev => ({
        ...prev,
        [update.driver]: update.data
      }));
    };
    
    setWs(websocket);
    
    return () => {
      websocket.close();
    };
  }, []);

  return (
    <div className="dashboard">
      <h1>🏎️ Live F1 Telemetry</h1>
      <div className="telemetry-grid">
        {Object.entries(telemetry)
          .sort(([, a], [, b]) => a.position - b.position)
          .map(([driver, data]) => (
            <TelemetryCard key={driver} driver={driver} data={data} />
          ))}
      </div>
    </div>
  );
}

function TelemetryCard({ driver, data }: { driver: string; data: TelemetryData }) {
  return (
    <div className="telemetry-card">
      <div className="driver-info">
        <span className="position">P{data.position}</span>
        <span className="driver">{driver}</span>
      </div>
      <div className="telemetry-data">
        <div className="metric">
          <span className="label">Speed</span>
          <span className="value">{data.speed} km/h</span>
        </div>
        <div className="metric">
          <span className="label">Gear</span>
          <span className="value">{data.gear}</span>
        </div>
        <div className="metric">
          <span className="label">Throttle</span>
          <span className="value">{data.throttle}%</span>
        </div>
        <div className="metric">
          <span className="label">Brake</span>
          <span className="value">{data.brake}%</span>
        </div>
      </div>
    </div>
  );
}
```

## Lap Time Analysis

Compare lap times and find optimal racing lines.

```python
import matplotlib.pyplot as plt
from t1api import T1ApiClient

client = T1ApiClient(api_key='YOUR_API_KEY')

def analyze_lap_comparison(session_id, drivers, lap_number):
    """Compare telemetry for multiple drivers on the same lap"""
    
    # Fetch telemetry for each driver
    telemetry_data = []
    for driver in drivers:
        telemetry = client.telemetry.get_historical(
            session=session_id,
            driver=driver,
            lap=lap_number
        )
        telemetry_data.append({
            'driver': driver,
            'data': telemetry['telemetry_points']
        })
    
    # Plot speed traces
    plt.figure(figsize=(15, 6))
    
    for data in telemetry_data:
        distances = [p['distance'] for p in data['data']]
        speeds = [p['speed'] for p in data['data']]
        plt.plot(distances, speeds, label=data['driver'], linewidth=2)
    
    plt.xlabel('Distance (m)')
    plt.ylabel('Speed (km/h)')
    plt.title(f'Speed Trace Comparison - Lap {lap_number}')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig(f'lap_comparison_{lap_number}.png')
    plt.show()
    
    # Find sectors where each driver was fastest
    print("\nSector Analysis:")
    for i in range(3):
        sector_speeds = []
        for data in telemetry_data:
            sector_data = [p for p in data['data'] if p['sector'] == i + 1]
            avg_speed = sum(p['speed'] for p in sector_data) / len(sector_data)
            sector_speeds.append((data['driver'], avg_speed))
        
        fastest = max(sector_speeds, key=lambda x: x[1])
        print(f"Sector {i + 1}: {fastest[0]} fastest (avg {fastest[1]:.1f} km/h)")

# Usage
analyze_lap_comparison(
    session_id='2025_round05_quali',
    drivers=['VER', 'HAM', 'LEC'],
    lap_number=1
)
```

## Tire Strategy Analysis

Analyze tire degradation and optimal pit stop windows.

```javascript
async function analyzeTireStrategy(sessionId, driver) {
  const laps = await client.lapData.query({
    session: sessionId,
    driver: driver
  });
  
  // Group laps by stint (tire compound)
  const stints = [];
  let currentStint = { compound: null, laps: [] };
  
  laps.forEach(lap => {
    if (lap.tire_compound !== currentStint.compound) {
      if (currentStint.laps.length > 0) {
        stints.push(currentStint);
      }
      currentStint = {
        compound: lap.tire_compound,
        laps: []
      };
    }
    currentStint.laps.push(lap);
  });
  
  if (currentStint.laps.length > 0) {
    stints.push(currentStint);
  }
  
  // Analyze each stint
  console.log(`\nTire Strategy Analysis for ${driver}:`);
  console.log('='.repeat(60));
  
  stints.forEach((stint, i) => {
    const baseline = stint.laps[0].lap_time_ms;
    const finalLap = stint.laps[stint.laps.length - 1].lap_time_ms;
    const degradation = ((finalLap - baseline) / baseline * 100).toFixed(2);
    
    console.log(`\nStint ${i + 1}: ${stint.compound} (${stint.laps.length} laps)`);
    console.log(`  Initial pace: ${stint.laps[0].lap_time}`);
    console.log(`  Final pace: ${stint.laps[stint.laps.length - 1].lap_time}`);
    console.log(`  Degradation: +${degradation}%`);
    
    // Find optimal stint length (before 3% degradation)
    let optimalLength = stint.laps.length;
    for (let j = 0; j < stint.laps.length; j++) {
      const deg = ((stint.laps[j].lap_time_ms - baseline) / baseline * 100);
      if (deg > 3) {
        optimalLength = j;
        break;
      }
    }
    console.log(`  Optimal length: ~${optimalLength} laps`);
  });
  
  return stints;
}

// Usage
analyzeTireStrategy('2025_round05_race', 'VER');
```

## Weather Impact Correlation

Analyze how weather conditions affect performance.

```python
import pandas as pd
import seaborn as sns
from t1api import T1ApiClient

client = T1ApiClient(api_key='YOUR_API_KEY')

def analyze_weather_impact(session_id):
    """Correlate weather conditions with lap times"""
    
    # Fetch data
    laps = client.lap_data.query(session=session_id)
    weather = client.weather.get_historical(session=session_id)
    
    # Create DataFrame
    df_laps = pd.DataFrame(laps)
    df_weather = pd.DataFrame(weather['weather_data'])
    
    # Merge on timestamp
    df = pd.merge_asof(
        df_laps.sort_values('timestamp'),
        df_weather.sort_values('timestamp'),
        on='timestamp',
        direction='nearest'
    )
    
    # Calculate correlation
    correlation = df[['lap_time_ms', 'track_temperature', 'air_temperature']].corr()
    
    print("\nWeather Impact Correlation:")
    print(correlation)
    
    # Visualize
    fig, axes = plt.subplots(1, 2, figsize=(15, 5))
    
    axes[0].scatter(df['track_temperature'], df['lap_time_ms'], alpha=0.6)
    axes[0].set_xlabel('Track Temperature (°C)')
    axes[0].set_ylabel('Lap Time (ms)')
    axes[0].set_title('Track Temperature vs Lap Time')
    
    axes[1].scatter(df['air_temperature'], df['lap_time_ms'], alpha=0.6)
    axes[1].set_xlabel('Air Temperature (°C)')
    axes[1].set_ylabel('Lap Time (ms)')
    axes[1].set_title('Air Temperature vs Lap Time')
    
    plt.tight_layout()
    plt.savefig('weather_impact.png')
    plt.show()

analyze_weather_impact('2025_round05_race')
```

## Driver Performance Heatmap

Visualize driver performance across different track sectors.

```python
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

def create_performance_heatmap(session_id, drivers):
    """Create a heatmap of driver performance by sector"""
    
    data = []
    
    for driver in drivers:
        laps = client.lap_data.query(session=session_id, driver=driver)
        
        # Calculate average sector times
        sector1_avg = np.mean([l['sector1_ms'] for l in laps]) / 1000
        sector2_avg = np.mean([l['sector2_ms'] for l in laps]) / 1000
        sector3_avg = np.mean([l['sector3_ms'] for l in laps]) / 1000
        
        data.append([sector1_avg, sector2_avg, sector3_avg])
    
    # Create heatmap
    df = pd.DataFrame(data, columns=['Sector 1', 'Sector 2', 'Sector 3'], index=drivers)
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(df, annot=True, fmt='.3f', cmap='RdYlGn_r', cbar_kws={'label': 'Time (s)'})
    plt.title('Driver Performance by Sector')
    plt.ylabel('Driver')
    plt.tight_layout()
    plt.savefig('performance_heatmap.png')
    plt.show()

create_performance_heatmap(
    '2025_round05_quali',
    ['VER', 'HAM', 'LEC', 'SAI', 'NOR']
)
```

## More Examples

Explore more examples in our GitHub repository:

- [Real-time Race Dashboard](https://github.com/turnone/t1api-examples/tree/main/dashboard)
- [Telemetry Analysis Tool](https://github.com/turnone/t1api-examples/tree/main/analysis)
- [Strategy Simulator](https://github.com/turnone/t1api-examples/tree/main/strategy)
- [Historical Data Explorer](https://github.com/turnone/t1api-examples/tree/main/explorer)

## Community Examples

Check out examples from the community:

- [F1 Data Visualization](https://github.com/community/f1-viz) by @user1
- [Live Timing App](https://github.com/community/timing) by @user2
- [Telemetry Comparison Tool](https://github.com/community/telemetry) by @user3

## Need Help?

- 💬 [Discord #examples](https://discord.gg/turnone)
- 📧 [examples@t1f1.com](mailto:examples@t1f1.com)
- 🐙 [GitHub Discussions](https://github.com/turnone/t1api/discussions)
