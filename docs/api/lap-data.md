# Lap Data API

Access lap times, sector splits, and detailed lap analysis data.

## Endpoints

### Query Lap Data

<span class="api-method api-method--get">GET</span> `/v1/lap-data`

Query lap times with flexible filtering options.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `session` | string | Session identifier |
| `driver` | string | Driver code filter |
| `lap_number` | integer | Specific lap number |
| `tire_compound` | string | Filter by tire compound |

#### Response

```json
{
  "data": [
    {
      "lap_id": "2025_r05_race_ver_45",
      "session_id": "2025_round05_race",
      "driver": {
        "code": "VER",
        "name": "Max Verstappen"
      },
      "lap_number": 45,
      "lap_time": "1:14.532",
      "lap_time_ms": 74532,
      "sector1_ms": 23456,
      "sector2_ms": 25678,
      "sector3_ms": 25398,
      "tire_compound": "MEDIUM",
      "tire_age": 18,
      "fuel_load": 68.5,
      "is_personal_best": false,
      "position": 1,
      "gap_to_leader": 0.0
    }
  ]
}
```

### Get Fastest Laps

<span class="api-method api-method--get">GET</span> `/v1/lap-data/fastest`

Get fastest laps for a session.

#### Response

```json
{
  "data": {
    "session_id": "2025_round05_race",
    "overall_fastest": {
      "driver": "VER",
      "lap_time": "1:12.909",
      "lap_number": 52
    },
    "by_compound": {
      "SOFT": {
        "driver": "LEC",
        "lap_time": "1:12.456"
      },
      "MEDIUM": {
        "driver": "VER",
        "lap_time": "1:12.909"
      }
    }
  }
}
```

## Code Examples

```javascript
// Get all laps for a driver
const laps = await client.lapData.query({
  session: '2025_round05_race',
  driver: 'VER'
});

// Find fastest lap
const fastest = laps.reduce((prev, curr) => 
  curr.lap_time_ms < prev.lap_time_ms ? curr : prev
);

console.log(`Fastest: ${fastest.lap_time} on lap ${fastest.lap_number}`);

// Analyze tire degradation
const softTireLaps = laps.filter(l => l.tire_compound === 'SOFT');
const degradation = softTireLaps.map(l => ({
  lap: l.lap_number,
  time: l.lap_time_ms,
  delta: l.lap_time_ms - softTireLaps[0].lap_time_ms
}));
```

[View more documentation...](/docs/api/overview)
