# Tire Strategy

Analyze tire performance and optimize pit stop strategy.

## Tire Degradation Analysis

```javascript
async function analyzeTireDegradation(sessionId, driver) {
  const laps = await client.lapData.query({
    session: sessionId,
    driver
  });
  
  // Group by compound
  const compounds = {};
  laps.forEach(lap => {
    if (!compounds[lap.tire_compound]) {
      compounds[lap.tire_compound] = [];
    }
    compounds[lap.tire_compound].push(lap);
  });
  
  // Analyze each stint
  Object.entries(compounds).forEach(([compound, stintLaps]) => {
    const baseline = stintLaps[0].lap_time_ms;
    const final = stintLaps[stintLaps.length - 1].lap_time_ms;
    const degradation = ((final - baseline) / baseline * 100).toFixed(2);
    
    console.log(`${compound}: ${stintLaps.length} laps, +${degradation}% deg`);
  });
}
```

See [Lap Data API](/docs/api/lap-data) for more information.
