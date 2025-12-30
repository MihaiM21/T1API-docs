# Sessions API

Access Formula One session data including race weekends, practice sessions, qualifying, and races.

## Endpoints

### Get Current Session

<span class="api-method api-method--get">GET</span> `/v1/sessions/current`

Get information about the currently active or most recent session.

#### Request

```http
GET /v1/sessions/current HTTP/1.1
Host: api.t1f1.com
Authorization: Bearer YOUR_API_KEY
```

#### Response

```json
{
  "data": {
    "session_id": "2025_round05_race",
    "type": "race",
    "name": "Monaco Grand Prix",
    "circuit": {
      "id": "monaco",
      "name": "Circuit de Monaco",
      "location": "Monte Carlo, Monaco",
      "length": 3.337,
      "laps": 78,
      "corners": 19
    },
    "start_time": "2025-05-25T13:00:00Z",
    "end_time": "2025-05-25T15:05:32Z",
    "status": "finished",
    "weather": {
      "track_temp": 42,
      "air_temp": 28,
      "condition": "dry"
    },
    "participants": 20
  }
}
```

### Get Session Details

<span class="api-method api-method--get">GET</span> `/v1/sessions/{session_id}`

Get detailed information about a specific session.

#### Response

```json
{
  "data": {
    "session_id": "2025_round05_quali",
    "type": "qualifying",
    "results": [
      {
        "position": 1,
        "driver": {
          "code": "LEC",
          "number": 16,
          "name": "Charles Leclerc"
        },
        "team": "Ferrari",
        "q1_time": "1:12.234",
        "q2_time": "1:11.567",
        "q3_time": "1:10.912",
        "gap_to_leader": "0.000"
      }
    ]
  }
}
```

### List Sessions

<span class="api-method api-method--get">GET</span> `/v1/sessions`

List all available sessions with optional filtering.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `year` | integer | Filter by year |
| `type` | string | Session type (practice, qualifying, race) |
| `circuit` | string | Circuit identifier |
| `limit` | integer | Results per page (max 100) |
| `offset` | integer | Pagination offset |

#### Response

```json
{
  "data": [
    {
      "session_id": "2025_round01_race",
      "name": "Bahrain Grand Prix",
      "circuit": "bahrain",
      "date": "2025-03-02",
      "type": "race"
    }
  ],
  "meta": {
    "total": 24,
    "limit": 20,
    "offset": 0
  }
}
```

## Code Examples

### JavaScript

```javascript
const client = new T1ApiClient({ apiKey: 'YOUR_API_KEY' });

// Get current session
const current = await client.sessions.getCurrent();
console.log(`Current: ${current.name} at ${current.circuit.name}`);

// List all 2025 races
const races = await client.sessions.list({
  year: 2025,
  type: 'race'
});
```

### Python

```python
client = T1ApiClient(api_key='YOUR_API_KEY')

# Get session details
session = client.sessions.get('2025_round05_race')
print(f"Winner: {session['results'][0]['driver']['name']}")
```

## Session Types

- `fp1`, `fp2`, `fp3` - Free Practice sessions
- `qualifying` - Qualifying session
- `sprint_qualifying` - Sprint qualifying
- `sprint` - Sprint race
- `race` - Main race

## Session Status

- `scheduled` - Not yet started
- `live` - Currently in progress
- `paused` - Red flag or interruption
- `finished` - Completed
- `cancelled` - Cancelled

[View more documentation...](/docs/api/overview)
