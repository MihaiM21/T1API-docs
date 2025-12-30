# Streaming Data

Access real-time Formula One data through WebSocket connections for live telemetry, timing, and position updates.

## WebSocket URL

```
wss://stream.t1f1.com/v1
```

## Available Streams

### Telemetry Stream

Real-time telemetry data from all cars.

```
wss://stream.t1f1.com/v1/telemetry?key=YOUR_API_KEY
```

### Timing Stream

Live timing data including lap times, sector splits, and gaps.

```
wss://stream.t1f1.com/v1/timing?key=YOUR_API_KEY
```

### Position Stream

Real-time position updates and track location data.

```
wss://stream.t1f1.com/v1/positions?key=YOUR_API_KEY
```

### Weather Stream

Live weather condition updates.

```
wss://stream.t1f1.com/v1/weather?key=YOUR_API_KEY
```

## Connection Example

### JavaScript/Node.js

```javascript
const WebSocket = require('ws');

const API_KEY = 'YOUR_API_KEY';
const ws = new WebSocket(`wss://stream.t1f1.com/v1/telemetry?key=${API_KEY}`);

ws.on('open', () => {
  console.log('🔴 Connected to T1API stream');
  
  // Subscribe to specific drivers
  ws.send(JSON.stringify({
    action: 'subscribe',
    drivers: ['VER', 'HAM', 'LEC']
  }));
});

ws.on('message', (data) => {
  const update = JSON.parse(data);
  console.log('Update:', update);
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('Disconnected from stream');
});
```

### Browser

```javascript
const ws = new WebSocket(`wss://stream.t1f1.com/v1/telemetry?key=${API_KEY}`);

ws.onopen = () => {
  console.log('Connected!');
  
  // Subscribe to all drivers
  ws.send(JSON.stringify({
    action: 'subscribe',
    drivers: '*'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  // Update UI with telemetry data
  document.getElementById('speed').textContent = data.speed;
  document.getElementById('gear').textContent = data.gear;
};
```

### Python

```python
import asyncio
import websockets
import json

async def stream_telemetry():
    uri = f'wss://stream.t1f1.com/v1/telemetry?key={API_KEY}'
    
    async with websockets.connect(uri) as websocket:
        # Subscribe to specific drivers
        await websocket.send(json.dumps({
            'action': 'subscribe',
            'drivers': ['VER', 'HAM', 'LEC']
        }))
        
        # Receive updates
        async for message in websocket:
            data = json.loads(message)
            print(f"Update: {data}")

asyncio.run(stream_telemetry())
```

## Message Format

### Telemetry Update

```json
{
  "type": "telemetry_update",
  "timestamp": "2025-03-15T14:23:45.123Z",
  "driver": "VER",
  "data": {
    "speed": 312,
    "gear": 8,
    "throttle": 100,
    "brake": 0,
    "rpm": 11500,
    "drs": 1,
    "position": 1,
    "lap": 45
  }
}
```

### Timing Update

```json
{
  "type": "timing_update",
  "timestamp": "2025-03-15T14:23:45.123Z",
  "driver": "VER",
  "data": {
    "current_lap": 45,
    "last_lap_time": "1:14.532",
    "sector1": "23.456",
    "sector2": "25.678",
    "sector3": "25.398",
    "gap_to_leader": "+0.000",
    "gap_to_ahead": "+0.000"
  }
}
```

### Position Update

```json
{
  "type": "position_update",
  "timestamp": "2025-03-15T14:23:45.123Z",
  "driver": "VER",
  "data": {
    "position": 1,
    "location": {
      "x": 1234.5,
      "y": 678.9,
      "z": 12.3
    },
    "lap_distance": 3456.7
  }
}
```

## Subscription Controls

### Subscribe to Specific Drivers

```javascript
ws.send(JSON.stringify({
  action: 'subscribe',
  drivers: ['VER', 'HAM', 'LEC']
}));
```

### Subscribe to All Drivers

```javascript
ws.send(JSON.stringify({
  action: 'subscribe',
  drivers: '*'
}));
```

### Unsubscribe from Drivers

```javascript
ws.send(JSON.stringify({
  action: 'unsubscribe',
  drivers: ['HAM']
}));
```

### Change Update Frequency

```javascript
ws.send(JSON.stringify({
  action: 'configure',
  frequency: 'low' // Options: low (1Hz), medium (5Hz), high (10Hz)
}));
```

## Connection Management

### Auto-Reconnect

```javascript
class T1WebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.reconnectDelay = 1000;
    this.maxReconnectDelay = 30000;
    this.reconnectAttempts = 0;
    this.connect();
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('Connected');
      this.reconnectDelay = 1000;
      this.reconnectAttempts = 0;
      
      if (this.options.onOpen) {
        this.options.onOpen();
      }
    };
    
    this.ws.onmessage = (event) => {
      if (this.options.onMessage) {
        const data = JSON.parse(event.data);
        this.options.onMessage(data);
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    this.ws.onclose = () => {
      console.log('Disconnected');
      this.reconnect();
    };
  }
  
  reconnect() {
    this.reconnectAttempts++;
    
    setTimeout(() => {
      console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
      this.connect();
    }, this.reconnectDelay);
    
    // Exponential backoff
    this.reconnectDelay = Math.min(
      this.reconnectDelay * 2,
      this.maxReconnectDelay
    );
  }
  
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
  
  close() {
    this.ws.close();
  }
}

// Usage
const stream = new T1WebSocket(
  `wss://stream.t1f1.com/v1/telemetry?key=${API_KEY}`,
  {
    onOpen: () => {
      stream.send({
        action: 'subscribe',
        drivers: ['VER', 'HAM']
      });
    },
    onMessage: (data) => {
      console.log('Telemetry:', data);
    }
  }
);
```

### Heartbeat/Ping

Keep connection alive with periodic pings:

```javascript
let heartbeatInterval;

ws.on('open', () => {
  heartbeatInterval = setInterval(() => {
    ws.send(JSON.stringify({ action: 'ping' }));
  }, 30000); // Every 30 seconds
});

ws.on('close', () => {
  clearInterval(heartbeatInterval);
});
```

## Rate Limits

WebSocket connections have the following limits:

- **Free tier**: 1 concurrent connection
- **Pro tier**: 5 concurrent connections
- **Enterprise**: Unlimited connections

## Best Practices

### 1. Handle Connection Drops

Always implement reconnection logic:

```javascript
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

function connect() {
  const ws = new WebSocket(url);
  
  ws.onclose = () => {
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      setTimeout(connect, 2000 * reconnectAttempts);
    }
  };
  
  ws.onopen = () => {
    reconnectAttempts = 0;
  };
  
  return ws;
}
```

### 2. Subscribe Selectively

Only subscribe to data you need:

```javascript
// ❌ Bad - All drivers, high frequency
ws.send(JSON.stringify({
  action: 'subscribe',
  drivers: '*',
  frequency: 'high'
}));

// ✅ Good - Specific drivers, appropriate frequency
ws.send(JSON.stringify({
  action: 'subscribe',
  drivers: ['VER', 'HAM'],
  frequency: 'medium'
}));
```

### 3. Buffer Updates

For UI updates, buffer WebSocket messages:

```javascript
let updateBuffer = [];
let updateTimer;

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateBuffer.push(data);
  
  if (!updateTimer) {
    updateTimer = setTimeout(() => {
      processUpdates(updateBuffer);
      updateBuffer = [];
      updateTimer = null;
    }, 100); // Process every 100ms
  }
};

function processUpdates(updates) {
  // Batch update UI
  updates.forEach(update => {
    updateDriverDisplay(update);
  });
}
```

### 4. Clean Up Connections

Always close connections when done:

```javascript
// Browser
window.addEventListener('beforeunload', () => {
  ws.close();
});

// React
useEffect(() => {
  const ws = new WebSocket(url);
  
  return () => {
    ws.close();
  };
}, []);
```

## Troubleshooting

### Connection Refused

```javascript
ws.on('error', (error) => {
  if (error.code === 'ECONNREFUSED') {
    console.error('Connection refused. Check your API key and network.');
  }
});
```

### Authentication Failed

```json
{
  "type": "error",
  "code": "auth_failed",
  "message": "Invalid API key"
}
```

### Session Not Active

```json
{
  "type": "error",
  "code": "no_active_session",
  "message": "No active F1 session. WebSocket will activate when session starts."
}
```

## Support

Questions about streaming?

- 📧 [streaming@t1f1.com](mailto:streaming@t1f1.com)
- 💬 [Discord #streaming](https://discord.gg/turnone)
- 📚 [API Reference](/docs/api/overview)
