# Drivers API

Access comprehensive Formula One driver information, statistics, and standings.

## Endpoints

### List All Drivers

<span class="api-method api-method--get">GET</span> `/v1/drivers`

Get a list of all drivers in the current season.

#### Response

```json
{
  "data": [
    {
      "driver_id": "max_verstappen",
      "code": "VER",
      "number": 1,
      "first_name": "Max",
      "last_name": "Verstappen",
      "nationality": "Dutch",
      "date_of_birth": "1997-09-30",
      "team": {
        "id": "red_bull",
        "name": "Red Bull Racing",
        "constructor": "Red Bull Racing Honda RBPT"
      }
    }
  ]
}
```

### Get Driver Details

<span class="api-method api-method--get">GET</span> `/v1/drivers/{driver_code}`

Get detailed information about a specific driver.

#### Response

```json
{
  "data": {
    "driver_id": "max_verstappen",
    "code": "VER",
    "number": 1,
    "name": "Max Verstappen",
    "team": "Red Bull Racing",
    "statistics": {
      "championships": 3,
      "race_wins": 54,
      "pole_positions": 35,
      "podiums": 97,
      "fastest_laps": 29,
      "points": 2586.5
    }
  }
}
```

### Get Driver Standings

<span class="api-method api-method--get">GET</span> `/v1/drivers/standings`

Get current championship standings.

#### Response

```json
{
  "data": {
    "season": 2025,
    "last_updated": "2025-05-25T15:30:00Z",
    "drivers": [
      {
        "position": 1,
        "driver": {
          "code": "VER",
          "name": "Max Verstappen"
        },
        "team": "Red Bull Racing",
        "points": 195,
        "wins": 4,
        "podiums": 7
      }
    ]
  }
}
```

## Code Examples

```javascript
// Get all drivers
const drivers = await client.drivers.list();

// Get specific driver
const verstappen = await client.drivers.get('VER');
console.log(`${verstappen.name} - ${verstappen.team}`);

// Get standings
const standings = await client.drivers.getStandings();
standings.drivers.forEach(d => {
  console.log(`${d.position}. ${d.driver.name} - ${d.points} pts`);
});
```

[View more documentation...](/docs/api/overview)
