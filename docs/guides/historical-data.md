# Historical Data

Access and analyze comprehensive historical Formula One data from past seasons, races, and sessions.

## Overview

T1API provides access to historical F1 data going back multiple seasons, including:

- Race results and session data
- Telemetry recordings
- Lap times and sector splits
- Driver and team statistics
- Weather conditions
- Pit stop information

## Data Retention

| Tier | Retention Period |
|------|-----------------|
| Free | 30 days |
| Pro | 1 year |
| Enterprise | Full history (2018+) |

## Querying Historical Data

### By Session

Query data for a specific session:

```javascript
const session = await client.sessions.get('2024_round20_race');
const telemetry = await client.telemetry.getHistorical({
  session: '2024_round20_race',
  driver: 'VER'
});
```

### By Date Range

Query data across a date range:

```javascript
const laps = await client.lapData.query({
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  driver: 'VER'
});
```

### By Season

Get all data for a specific season:

```javascript
const sessions = await client.sessions.list({
  year: 2024,
  type: 'race'
});

// Get all race results for 2024
const results = await Promise.all(
  sessions.map(session => 
    client.sessions.get(session.session_id)
  )
);
```

## Common Use Cases

### 1. Driver Performance Analysis

Compare driver performance across multiple races:

```javascript
async function analyzeDriverSeason(driverCode, year) {
  // Get all race sessions for the year
  const races = await client.sessions.list({
    year,
    type: 'race'
  });
  
  // Get lap data for each race
  const performance = await Promise.all(
    races.map(async (race) => {
      const laps = await client.lapData.query({
        session: race.session_id,
        driver: driverCode
      });
      
      const fastestLap = laps.reduce((prev, curr) => 
        curr.lap_time_ms < prev.lap_time_ms ? curr : prev
      );
      
      return {
        race: race.name,
        fastest_lap: fastestLap.lap_time,
        avg_speed: laps.reduce((sum, l) => sum + l.speed, 0) / laps.length
      };
    })
  );
  
  return performance;
}

const verstappen2024 = await analyzeDriverSeason('VER', 2024);
console.log(verstappen2024);
```

### 2. Lap Time Evolution

Analyze how lap times evolve during a stint:

```javascript
async function analyzeTireDegradation(sessionId, driverCode) {
  const laps = await client.lapData.query({
    session: sessionId,
    driver: driverCode
  });
  
  // Group by tire compound
  const stints = laps.reduce((acc, lap) => {
    if (!acc[lap.tire_compound]) {
      acc[lap.tire_compound] = [];
    }
    acc[lap.tire_compound].push(lap);
    return acc;
  }, {});
  
  // Analyze each stint
  Object.entries(stints).forEach(([compound, stintLaps]) => {
    const baseline = stintLaps[0].lap_time_ms;
    
    console.log(`\n${compound} Tire Degradation:`);
    stintLaps.forEach((lap, i) => {
      const delta = ((lap.lap_time_ms - baseline) / baseline * 100).toFixed(2);
      console.log(`Lap ${i + 1}: ${lap.lap_time} (+${delta}%)`);
    });
  });
}
```

### 3. Sector Comparison

Compare sector times between drivers:

```javascript
async function compareSectors(sessionId, lap, drivers) {
  const lapData = await Promise.all(
    drivers.map(driver =>
      client.lapData.query({
        session: sessionId,
        driver,
        lap_number: lap
      })
    )
  );
  
  console.log('Sector Comparison:');
  console.log('Driver | S1 | S2 | S3 | Total');
  console.log('-------|----|----|----| ------');
  
  lapData.forEach(data => {
    const lap = data[0];
    console.log(
      `${lap.driver.code} | ` +
      `${(lap.sector1_ms / 1000).toFixed(3)} | ` +
      `${(lap.sector2_ms / 1000).toFixed(3)} | ` +
      `${(lap.sector3_ms / 1000).toFixed(3)} | ` +
      `${lap.lap_time}`
    );
  });
}

await compareSectors('2024_round20_quali', 1, ['VER', 'HAM', 'LEC']);
```

### 4. Weather Impact Analysis

Analyze how weather affects lap times:

```javascript
async function analyzeWeatherImpact(sessionId) {
  const [laps, weather] = await Promise.all([
    client.lapData.query({ session: sessionId }),
    client.weather.getHistorical({ session: sessionId })
  ]);
  
  // Correlate lap times with track temperature
  const correlation = laps.map(lap => {
    const closestWeather = weather.weather_data
      .reduce((prev, curr) => {
        const prevDiff = Math.abs(new Date(prev.timestamp) - new Date(lap.timestamp));
        const currDiff = Math.abs(new Date(curr.timestamp) - new Date(lap.timestamp));
        return currDiff < prevDiff ? curr : prev;
      });
    
    return {
      lap: lap.lap_number,
      lap_time: lap.lap_time_ms,
      track_temp: closestWeather.track_temp,
      condition: closestWeather.condition
    };
  });
  
  return correlation;
}
```

### 5. Telemetry Overlay

Create telemetry overlays for lap comparison:

```javascript
async function createTelemetryOverlay(sessionId, lap, drivers) {
  const telemetryData = await Promise.all(
    drivers.map(driver =>
      client.telemetry.getHistorical({
        session: sessionId,
        driver,
        lap
      })
    )
  );
  
  // Export to CSV for visualization
  const csv = ['Distance,Driver,Speed,Throttle,Brake,Gear'];
  
  telemetryData.forEach(data => {
    data.telemetry_points.forEach(point => {
      csv.push([
        point.distance,
        data.driver,
        point.speed,
        point.throttle,
        point.brake,
        point.gear
      ].join(','));
    });
  });
  
  return csv.join('\n');
}
```

## Data Export

### Export to CSV

```javascript
async function exportToCSV(sessionId, filename) {
  const laps = await client.lapData.query({
    session: sessionId
  });
  
  const csv = [
    'Driver,Lap,Time,S1,S2,S3,Compound,Age,Position',
    ...laps.map(lap => [
      lap.driver.code,
      lap.lap_number,
      lap.lap_time,
      lap.sector1_ms / 1000,
      lap.sector2_ms / 1000,
      lap.sector3_ms / 1000,
      lap.tire_compound,
      lap.tire_age,
      lap.position
    ].join(','))
  ].join('\n');
  
  // Save to file
  fs.writeFileSync(filename, csv);
}
```

### Export to JSON

```javascript
async function exportToJSON(sessionId, filename) {
  const [session, laps, telemetry] = await Promise.all([
    client.sessions.get(sessionId),
    client.lapData.query({ session: sessionId }),
    client.telemetry.getHistorical({ session: sessionId })
  ]);
  
  const data = {
    session,
    laps,
    telemetry,
    exported_at: new Date().toISOString()
  };
  
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}
```

## Caching Strategies

Historical data doesn't change, so implement aggressive caching:

```javascript
class HistoricalDataCache {
  constructor() {
    this.cache = new Map();
  }
  
  async get(key, fetcher) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const data = await fetcher();
    this.cache.set(key, data);
    
    // Optionally persist to disk
    await this.saveToDisk(key, data);
    
    return data;
  }
  
  async saveToDisk(key, data) {
    const filename = `cache/${key}.json`;
    await fs.promises.writeFile(
      filename,
      JSON.stringify(data)
    );
  }
}

const cache = new HistoricalDataCache();

const laps = await cache.get(
  'laps_2024_round20_race',
  () => client.lapData.query({ session: '2024_round20_race' })
);
```

## Performance Tips

1. **Request only what you need**: Use field selection to reduce payload size
2. **Paginate large datasets**: Use limit/offset for large queries
3. **Cache aggressively**: Historical data never changes
4. **Batch requests**: Combine multiple queries when possible
5. **Use appropriate frequency**: For telemetry, choose lower frequency for analysis

## Data Availability

Historical data is processed and available:

- **Live data**: Available during session
- **Session data**: Available immediately after session
- **Telemetry**: Available 30 minutes after session
- **Full analysis**: Available 2 hours after session

## Rate Limits

Historical data endpoints:

- `/sessions/*`: 1000 req/min
- `/lap-data`: 100 req/min
- `/telemetry/historical`: 100 req/min

[View Rate Limits](/docs/guides/rate-limits)

## Support

Questions about historical data?

- 📧 [data@t1f1.com](mailto:data@t1f1.com)
- 💬 [Discord #historical-data](https://discord.gg/turnone)
