# Weather API

Access current and historical weather data for F1 circuits.

## Endpoints

### Get Current Weather

<span class="api-method api-method--get">GET</span> `/v1/weather/current`

Get current weather conditions at the active circuit.

#### Response

```json
{
  "data": {
    "circuit": "monaco",
    "timestamp": "2025-05-25T13:45:00Z",
    "air_temperature": 28.5,
    "track_temperature": 42.3,
    "humidity": 45,
    "pressure": 1013.2,
    "wind_speed": 12.5,
    "wind_direction": 225,
    "rainfall": 0,
    "condition": "dry"
  }
}
```

### Get Historical Weather

<span class="api-method api-method--get">GET</span> `/v1/weather/historical`

Query weather data from past sessions.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `session` | string | Session identifier |
| `start_time` | string | ISO timestamp |
| `end_time` | string | ISO timestamp |

#### Response

```json
{
  "data": {
    "session_id": "2025_round05_race",
    "weather_data": [
      {
        "timestamp": "2025-05-25T13:00:00Z",
        "air_temp": 27.8,
        "track_temp": 40.2,
        "condition": "dry",
        "rainfall": 0
      }
    ]
  }
}
```

## Weather Conditions

- `dry` - Dry track
- `damp` - Damp track (drying)
- `wet` - Wet track
- `storm` - Heavy rain/storm

## Code Examples

```javascript
// Get current weather
const weather = await client.weather.getCurrent();
console.log(`Track temp: ${weather.track_temperature}°C`);

// Monitor weather changes during race
const historical = await client.weather.getHistorical({
  session: '2025_round05_race'
});

const tempChange = historical.weather_data[historical.weather_data.length - 1].track_temp - 
                   historical.weather_data[0].track_temp;
console.log(`Track temp changed by ${tempChange}°C during race`);
```

[View more documentation...](/docs/api/overview)
