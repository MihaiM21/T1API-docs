# Telemetry Basics

Understanding Formula One telemetry data and how to analyze it.

## What is Telemetry?

Telemetry is real-time data transmitted from F1 cars to pit crews and teams. It includes hundreds of data channels measuring everything from speed and throttle position to tire temperatures and fuel consumption.

## Key Telemetry Channels

### Speed & Motion

- **Speed**: Current velocity in km/h
- **G-Forces**: Lateral, longitudinal, and vertical acceleration
- **Location**: GPS coordinates and track position

### Driver Inputs

- **Throttle**: Percentage (0-100%)
- **Brake**: Pressure percentage (0-100%)
- **Steering**: Wheel angle in degrees
- **Gear**: Current gear selection (1-8, plus reverse)
- **Clutch**: Clutch position

### Power Unit

- **RPM**: Engine revolutions per minute
- **DRS**: Drag Reduction System status
- **ERS**: Energy Recovery System data
  - Deployment mode
  - Battery state of charge
  - MGU-K harvest/deploy
  - MGU-H harvest/deploy

### Tires

- **Compound**: Tire type (SOFT, MEDIUM, HARD, INTER, WET)
- **Age**: Number of laps on current tires
- **Temperatures**: Surface and inner temperatures per tire
- **Pressure**: PSI per tire
- **Wear**: Estimated wear percentage

## Reading Telemetry Data

### Speed Trace

```javascript
const telemetry = await client.telemetry.getHistorical({
  session: '2025_round05_quali',
  driver: 'VER',
  lap: 1
});

// Plot speed vs distance
const distances = telemetry.telemetry_points.map(p => p.distance);
const speeds = telemetry.telemetry_points.map(p => p.speed);

// Find braking zones
const brakingZones = telemetry.telemetry_points
  .filter(p => p.brake > 80)
  .map(p => ({ distance: p.distance, brake: p.brake }));

console.log('Major braking zones:', brakingZones);
```

### Throttle Analysis

```javascript
// Analyze throttle application
const throttleData = telemetry.telemetry_points.map(p => ({
  distance: p.distance,
  throttle: p.throttle,
  speed: p.speed
}));

// Find full throttle sections
const fullThrottle = throttleData.filter(p => p.throttle === 100);
const fullThrottlePercentage = (fullThrottle.length / throttleData.length * 100).toFixed(1);

console.log(`Full throttle: ${fullThrottlePercentage}% of lap`);
```

### Gear Changes

```javascript
// Track gear changes
let gearChanges = 0;
let previousGear = telemetry.telemetry_points[0].gear;

telemetry.telemetry_points.forEach(point => {
  if (point.gear !== previousGear) {
    gearChanges++;
    console.log(`Gear change at ${point.distance}m: ${previousGear} → ${point.gear}`);
    previousGear = point.gear;
  }
});

console.log(`Total gear changes: ${gearChanges}`);
```

## Analyzing Performance

### Corner Analysis

```javascript
function analyzeCorner(telemetry, startDistance, endDistance) {
  const cornerData = telemetry.telemetry_points
    .filter(p => p.distance >= startDistance && p.distance <= endDistance);
  
  const entrySpeed = cornerData[0].speed;
  const minSpeed = Math.min(...cornerData.map(p => p.speed));
  const exitSpeed = cornerData[cornerData.length - 1].speed;
  
  const brakingPoint = cornerData.find(p => p.brake > 10);
  const throttlePoint = cornerData.findIndex(p => p.throttle > 50);
  
  return {
    entry_speed: entrySpeed,
    min_speed: minSpeed,
    exit_speed: exitSpeed,
    braking_point: brakingPoint ? brakingPoint.distance : null,
    time_to_throttle: throttlePoint
  };
}

// Analyze Turn 1
const turn1 = analyzeCorner(telemetry, 100, 300);
console.log('Turn 1 Analysis:', turn1);
```

### Driver Comparison

```javascript
async function compareDrivers(sessionId, lap, drivers) {
  const telemetryData = await Promise.all(
    drivers.map(driver =>
      client.telemetry.getHistorical({
        session: sessionId,
        driver,
        lap
      })
    )
  );
  
  // Compare minimum speeds through corners
  drivers.forEach((driver, i) => {
    const minSpeed = Math.min(...telemetryData[i].telemetry_points.map(p => p.speed));
    console.log(`${driver} minimum speed: ${minSpeed} km/h`);
  });
  
  // Compare time on throttle
  drivers.forEach((driver, i) => {
    const fullThrottleTime = telemetryData[i].telemetry_points
      .filter(p => p.throttle === 100).length;
    console.log(`${driver} full throttle: ${fullThrottleTime} samples`);
  });
}

await compareDrivers('2025_round05_quali', 1, ['VER', 'HAM', 'LEC']);
```

## Common Patterns

### Finding the Racing Line

```javascript
function findRacingLine(telemetry) {
  // Racing line typically has highest average speed
  const sectors = [
    { start: 0, end: telemetry.telemetry_points.length / 3 },
    { start: telemetry.telemetry_points.length / 3, end: 2 * telemetry.telemetry_points.length / 3 },
    { start: 2 * telemetry.telemetry_points.length / 3, end: telemetry.telemetry_points.length }
  ];
  
  sectors.forEach((sector, i) => {
    const sectorData = telemetry.telemetry_points.slice(sector.start, sector.end);
    const avgSpeed = sectorData.reduce((sum, p) => sum + p.speed, 0) / sectorData.length;
    console.log(`Sector ${i + 1} average speed: ${avgSpeed.toFixed(1)} km/h`);
  });
}
```

### Identifying Setup Issues

```javascript
function analyzeSetup(telemetry) {
  const issues = [];
  
  // Check for excessive tire temperatures
  const maxTireTemp = Math.max(...telemetry.telemetry_points
    .flatMap(p => Object.values(p.tire_temps)));
  
  if (maxTireTemp > 110) {
    issues.push('Tires overheating - consider softer setup');
  }
  
  // Check for brake issues
  const maxBrakeTemp = Math.max(...telemetry.telemetry_points
    .flatMap(p => Object.values(p.brake_temps)));
  
  if (maxBrakeTemp > 800) {
    issues.push('Brakes overheating - check cooling ducts');
  }
  
  // Check for balance issues (comparing left/right tire temps)
  const avgLeftTemp = telemetry.telemetry_points
    .reduce((sum, p) => sum + p.tire_temps.fl + p.tire_temps.rl, 0) / (telemetry.telemetry_points.length * 2);
  
  const avgRightTemp = telemetry.telemetry_points
    .reduce((sum, p) => sum + p.tire_temps.fr + p.tire_temps.rr, 0) / (telemetry.telemetry_points.length * 2);
  
  const tempDiff = Math.abs(avgLeftTemp - avgRightTemp);
  if (tempDiff > 5) {
    issues.push('Temperature imbalance - check setup balance');
  }
  
  return issues;
}
```

## Visualization

### Python with Matplotlib

```python
import matplotlib.pyplot as plt
from t1api import T1ApiClient

client = T1ApiClient(api_key='YOUR_API_KEY')

# Fetch telemetry
telemetry = client.telemetry.get_historical(
    session='2025_round05_quali',
    driver='VER',
    lap=1
)

# Extract data
distances = [p['distance'] for p in telemetry['telemetry_points']]
speeds = [p['speed'] for p in telemetry['telemetry_points']]
throttle = [p['throttle'] for p in telemetry['telemetry_points']]
brake = [p['brake'] for p in telemetry['telemetry_points']]

# Create visualization
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(15, 10), sharex=True)

# Speed trace
ax1.plot(distances, speeds, 'r-', linewidth=2)
ax1.set_ylabel('Speed (km/h)', fontsize=12)
ax1.set_title('VER - Qualifying Lap 1', fontsize=14, fontweight='bold')
ax1.grid(True, alpha=0.3)

# Throttle and brake
ax2.fill_between(distances, 0, throttle, color='green', alpha=0.6, label='Throttle')
ax2.fill_between(distances, 0, [-b for b in brake], color='red', alpha=0.6, label='Brake')
ax2.set_xlabel('Distance (m)', fontsize=12)
ax2.set_ylabel('Input (%)', fontsize=12)
ax2.legend()
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('telemetry_analysis.png', dpi=300)
plt.show()
```

## Next Steps

- [Lap Comparison](/docs/analysis/lap-comparison) - Compare laps and drivers
- [Sector Analysis](/docs/analysis/sector-analysis) - Deep dive into sectors
- [Tire Strategy](/docs/analysis/tire-strategy) - Analyze tire performance

## Resources

- 📊 [Telemetry API Reference](/docs/api/telemetry)
- 💡 [Code Examples](/docs/examples)
- 🎓 [F1 Data Analysis Course](https://turnonehub.com/courses)
