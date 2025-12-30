# Lap Comparison

Learn how to compare laps between different drivers or different attempts by the same driver.

## Basic Lap Comparison

```javascript
async function compareLaps(sessionId, comparisons) {
  // comparisons = [{ driver: 'VER', lap: 1 }, { driver: 'HAM', lap: 1 }]
  
  const lapData = await Promise.all(
    comparisons.map(({ driver, lap }) =>
      client.lapData.query({
        session: sessionId,
        driver,
        lap_number: lap
      })
    )
  );
  
  console.log('Lap Time Comparison:');
  lapData.forEach((data, i) => {
    const lap = data[0];
    console.log(`${lap.driver.name}: ${lap.lap_time}`);
    console.log(`  S1: ${(lap.sector1_ms / 1000).toFixed(3)}s`);
    console.log(`  S2: ${(lap.sector2_ms / 1000).toFixed(3)}s`);
    console.log(`  S3: ${(lap.sector3_ms / 1000).toFixed(3)}s\n`);
  });
}
```

For more details, visit [Lap Data API](/docs/api/lap-data).
