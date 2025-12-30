# Sector Analysis

Deep dive into sector performance and optimization.

## Analyzing Sector Performance

```javascript
async function analyzeSectors(sessionId, driver) {
  const laps = await client.lapData.query({
    session: sessionId,
    driver
  });
  
  // Find best sector times
  const bestS1 = Math.min(...laps.map(l => l.sector1_ms));
  const bestS2 = Math.min(...laps.map(l => l.sector2_ms));
  const bestS3 = Math.min(...laps.map(l => l.sector3_ms));
  
  const theoreticalBest = (bestS1 + bestS2 + bestS3) / 1000;
  const actualBest = Math.min(...laps.map(l => l.lap_time_ms)) / 1000;
  
  console.log(`Theoretical best: ${theoreticalBest.toFixed(3)}s`);
  console.log(`Actual best: ${actualBest.toFixed(3)}s`);
  console.log(`Delta: ${(actualBest - theoreticalBest).toFixed(3)}s`);
}
```

Learn more in the [Lap Data API](/docs/api/lap-data).
