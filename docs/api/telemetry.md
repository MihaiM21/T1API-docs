# Telemetry API

Access real-time and historical Formula One telemetry data including speed, throttle, brake pressure, gear selection, DRS status, and more.

## Endpoints

### Get Live Telemetry

<span class="api-method api-method--get">GET</span> `/v1/telemetry/live`

Get current real-time telemetry data for all drivers in the active session.

#### Request

```http
GET /v1/telemetry/live HTTP/1.1
Host: api.t1f1.com
Authorization: Bearer YOUR_API_KEY
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `driver` | string | No | Filter by driver code (e.g., VER, HAM) |
| `fields` | string | No | Comma-separated list of fields to include |

#### Response

```json
{
  "data": {
    "session_id": "2025_round01_race",
    "timestamp": "2025-03-15T14:23:45.123Z",
    "telemetry": [
      {
        "driver": {
          "code": "VER",
          "number": 1,
          "name": "Max Verstappen",
          "team": "Red Bull Racing"
        },
        "position": 1,
        "speed": 312,
        "gear": 8,
        "throttle": 100,
        "brake": 0,
        "rpm": 11500,
        "drs": 1,
        "ers_deploy_mode": 0,
        "ers_store_energy": 2.4,
        "fuel_remaining": 85.3,
        "tire_compound": "SOFT",
        "tire_age": 12,
        "tire_temps": {
          "fl": 95.2,
          "fr": 96.1,
          "rl": 98.3,
          "rr": 97.8
        },
        "brake_temps": {
          "fl": 450,
          "fr": 455,
          "rl": 420,
          "rr": 425
        },
        "location": {
          "x": 1234.5,
          "y": 678.9,
          "z": 12.3
        }
      }
    ]
  },
  "meta": {
    "timestamp": "2025-03-15T14:23:45.123Z",
    "request_id": "req_abc123"
  }
}
```

### Get Driver Telemetry

<span class="api-method api-method--get">GET</span> `/v1/telemetry/driver/{driver_code}`

Get detailed telemetry for a specific driver.

#### Request

```http
GET /v1/telemetry/driver/VER HTTP/1.1
Host: api.t1f1.com
Authorization: Bearer YOUR_API_KEY
```

#### Response

```json
{
  "data": {
    "driver": {
      "code": "VER",
      "number": 1,
      "name": "Max Verstappen"
    },
    "current_lap": 45,
    "telemetry": {
      "speed": 308,
      "gear": 7,
      "throttle": 98,
      "brake": 0,
      "rpm": 11200,
      "drs": 0,
      "steering_angle": -12.5,
      "g_force": {
        "lateral": 2.3,
        "longitudinal": 0.8,
        "vertical": 1.2
      }
    },
    "timestamp": "2025-03-15T14:23:45.123Z"
  }
}
```

### Get Historical Telemetry

<span class="api-method api-method--get">GET</span> `/v1/telemetry/historical`

Query historical telemetry data from past sessions.

#### Request

```http
GET /v1/telemetry/historical?session=2025_round01_race&driver=VER&lap=45 HTTP/1.1
Host: api.t1f1.com
Authorization: Bearer YOUR_API_KEY
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session` | string | Yes | Session identifier |
| `driver` | string | No | Driver code filter |
| `lap` | integer | No | Specific lap number |
| `start_time` | string | No | ISO timestamp for range start |
| `end_time` | string | No | ISO timestamp for range end |
| `frequency` | string | No | Data frequency (full, second, five_seconds) |

#### Response

```json
{
  "data": {
    "session": "2025_round01_race",
    "driver": "VER",
    "lap": 45,
    "telemetry_points": [
      {
        "timestamp": "2025-03-15T14:23:45.123Z",
        "distance": 1234.5,
        "speed": 308,
        "gear": 7,
        "throttle": 98,
        "brake": 0,
        "rpm": 11200,
        "drs": 0
      },
      // ... more data points
    ]
  },
  "meta": {
    "total_points": 5000,
    "sampling_rate": "100ms"
  }
}
```

## Telemetry Data Fields

### Basic Telemetry

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `speed` | number | km/h | Current speed |
| `gear` | integer | - | Current gear (0-8, 0 = neutral, -1 = reverse) |
| `throttle` | number | % | Throttle position (0-100) |
| `brake` | number | % | Brake pressure (0-100) |
| `rpm` | number | - | Engine RPM |
| `drs` | integer | - | DRS status (0 = off, 1 = available, 2 = active) |
| `steering_angle` | number | degrees | Steering wheel angle |

### Advanced Telemetry

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `ers_deploy_mode` | integer | - | ERS deployment mode (0-4) |
| `ers_store_energy` | number | MJ | Energy stored in ERS battery |
| `ers_harvested_mguk` | number | MJ | Energy harvested from MGU-K this lap |
| `ers_harvested_mguh` | number | MJ | Energy harvested from MGU-H this lap |
| `fuel_remaining` | number | kg | Remaining fuel load |
| `fuel_capacity` | number | kg | Total fuel capacity |

### Tire Data

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `tire_compound` | string | - | Tire compound (SOFT, MEDIUM, HARD, INTER, WET) |
| `tire_age` | integer | laps | Age of current tires |
| `tire_wear` | object | % | Wear percentage per tire |
| `tire_temps` | object | °C | Surface temperature per tire |
| `tire_pressures` | object | PSI | Pressure per tire |

### Position Data

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `location.x` | number | m | X coordinate on track |
| `location.y` | number | m | Y coordinate on track |
| `location.z` | number | m | Z coordinate (elevation) |
| `lap_distance` | number | m | Distance into current lap |
| `total_distance` | number | m | Total race distance covered |

### G-Forces

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `g_force.lateral` | number | G | Lateral G-force |
| `g_force.longitudinal` | number | G | Longitudinal G-force |
| `g_force.vertical` | number | G | Vertical G-force |

## WebSocket Stream

For real-time telemetry updates, use the WebSocket API:

```javascript
const ws = new WebSocket('wss://stream.t1f1.com/v1/telemetry?key=YOUR_API_KEY');

ws.onopen = () => {
  console.log('Connected to telemetry stream');
  
  // Subscribe to specific drivers
  ws.send(JSON.stringify({
    action: 'subscribe',
    drivers: ['VER', 'HAM', 'LEC']
  }));
};

ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  console.log('Telemetry update:', update);
};
```

### WebSocket Message Format

```json
{
  "type": "telemetry_update",
  "timestamp": "2025-03-15T14:23:45.123Z",
  "data": {
    "driver": "VER",
    "speed": 312,
    "gear": 8,
    "throttle": 100,
    "brake": 0,
    "rpm": 11500,
    "drs": 1
  }
}
```

## Code Examples

### JavaScript/TypeScript

```typescript
import { T1ApiClient } from '@t1api/client';

const client = new T1ApiClient({
  apiKey: process.env.T1API_KEY
});

// Get live telemetry
const telemetry = await client.telemetry.getLive({
  driver: 'VER'
});

console.log(`Speed: ${telemetry.speed} km/h`);
console.log(`Gear: ${telemetry.gear}`);
console.log(`DRS: ${telemetry.drs ? 'Active' : 'Inactive'}`);

// Stream live telemetry
const stream = client.telemetry.stream({
  drivers: ['VER', 'HAM']
});

stream.on('update', (data) => {
  console.log(`${data.driver}: ${data.speed} km/h`);
});
```

### Python

```python
from t1api import T1ApiClient

client = T1ApiClient(api_key='YOUR_API_KEY')

# Get live telemetry
telemetry = client.telemetry.get_live(driver='VER')

print(f"Speed: {telemetry['speed']} km/h")
print(f"Gear: {telemetry['gear']}")
print(f"DRS: {'Active' if telemetry['drs'] else 'Inactive'}")

# Get historical telemetry
historical = client.telemetry.get_historical(
    session='2025_round01_race',
    driver='VER',
    lap=45
)

# Analyze throttle patterns
for point in historical['telemetry_points']:
    if point['throttle'] == 100:
        print(f"Full throttle at {point['speed']} km/h")
```

### cURL

```bash
# Get live telemetry
curl -X GET "https://api.t1f1.com/v1/telemetry/live?driver=VER" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Get historical telemetry
curl -X GET "https://api.t1f1.com/v1/telemetry/historical?session=2025_round01_race&driver=VER&lap=45" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Use Cases

### Compare Driver Lines

```javascript
// Get telemetry for multiple drivers on the same lap
const drivers = ['VER', 'HAM', 'LEC'];
const lap = 45;

const telemetryData = await Promise.all(
  drivers.map(driver => 
    client.telemetry.getHistorical({
      session: '2025_round01_quali',
      driver,
      lap
    })
  )
);

// Compare speeds through corner
const corner = telemetryData.map(data => ({
  driver: data.driver,
  minSpeed: Math.min(...data.telemetry_points.map(p => p.speed))
}));

console.log(corner);
```

### Track Tire Degradation

```javascript
// Monitor tire performance over stint
const stint = [];
for (let lap = 1; lap <= 20; lap++) {
  const telemetry = await client.telemetry.getHistorical({
    session: '2025_round01_race',
    driver: 'VER',
    lap
  });
  
  stint.push({
    lap,
    avgSpeed: telemetry.telemetry_points.reduce((sum, p) => sum + p.speed, 0) / telemetry.telemetry_points.length,
    tireTemp: telemetry.telemetry_points[0].tire_temps
  });
}

console.log('Tire degradation analysis:', stint);
```

## Rate Limits

Telemetry endpoints have specific rate limits:

- **Live telemetry**: 60 requests/minute
- **Historical queries**: 100 requests/minute
- **WebSocket streams**: 1 connection per API key

## Best Practices

1. **Use WebSockets for real-time data** - More efficient than polling
2. **Filter data at the API level** - Use query parameters to reduce payload size
3. **Cache historical data** - Historical data doesn't change
4. **Batch requests** - Combine multiple queries when possible
5. **Monitor rate limits** - Check response headers and implement backoff

## Related Endpoints

- [Sessions API](/docs/api/sessions) - Get session information
- [Lap Data API](/docs/api/lap-data) - Access lap times and sectors
- [Drivers API](/docs/api/drivers) - Get driver information

## Support

Questions about telemetry data?

- 📧 [telemetry@t1f1.com](mailto:telemetry@t1f1.com)
- 💬 [Discord #telemetry channel](https://discord.gg/turnone)
- 📚 [Data Dictionary](https://turnonehub.com/data-dictionary)
