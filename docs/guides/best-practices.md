# Best Practices

Guidelines and recommendations for building robust applications with T1API.

## Authentication & Security

### Store API Keys Securely

```javascript
// ✅ Good - Environment variables
const apiKey = process.env.T1API_KEY;

// ❌ Bad - Hardcoded
const apiKey = 'sk_live_1234567890';
```

### Rotate Keys Regularly

- Generate new keys every 90 days
- Use different keys for different environments
- Revoke compromised keys immediately

### Never Expose Keys in Frontend

```javascript
// ❌ Bad - Exposed in browser
const ws = new WebSocket(`wss://stream.t1f1.com/v1/telemetry?key=${apiKey}`);

// ✅ Good - Proxy through your backend
const ws = new WebSocket('wss://your-backend.com/telemetry');
```

## Error Handling

### Implement Retry Logic

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        if (response.status >= 500) {
          // Server error, retry
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
          continue;
        }
        // Client error, don't retry
        throw new Error(`API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

### Handle All Error Types

```javascript
try {
  const data = await client.telemetry.getLive();
} catch (error) {
  if (error.status === 401) {
    // Invalid API key
    console.error('Authentication failed');
  } else if (error.status === 429) {
    // Rate limited
    console.error('Rate limit exceeded');
  } else if (error.status >= 500) {
    // Server error
    console.error('Server error, retrying...');
  } else {
    // Other error
    console.error('Unexpected error:', error);
  }
}
```

## Rate Limiting

### Monitor Rate Limits

```javascript
class RateLimitTracker {
  constructor() {
    this.remaining = null;
    this.resetAt = null;
  }
  
  updateFromResponse(response) {
    this.remaining = parseInt(response.headers.get('X-RateLimit-Remaining'));
    this.resetAt = parseInt(response.headers.get('X-RateLimit-Reset'));
  }
  
  shouldWait() {
    return this.remaining < 10; // Wait if less than 10 requests remaining
  }
  
  getWaitTime() {
    return Math.max(0, this.resetAt - Math.floor(Date.now() / 1000));
  }
}
```

### Implement Exponential Backoff

```javascript
async function exponentialBackoff(fn, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const waitTime = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
}
```

## Caching

### Cache Static Data

```javascript
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedData(key, fetcher) {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  
  return data;
}

// Usage
const sessions = await getCachedData(
  'sessions_2025',
  () => client.sessions.list({ year: 2025 })
);
```

### Cache Historical Data Permanently

```javascript
const fs = require('fs/promises');
const path = require('path');

async function getPermanentCachedData(key, fetcher) {
  const cacheFile = path.join('cache', `${key}.json`);
  
  try {
    const cached = await fs.readFile(cacheFile, 'utf-8');
    return JSON.parse(cached);
  } catch (error) {
    const data = await fetcher();
    await fs.writeFile(cacheFile, JSON.stringify(data));
    return data;
  }
}
```

## WebSocket Connections

### Implement Auto-Reconnect

```javascript
class ResilientWebSocket {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.reconnectDelay = 1000;
    this.maxReconnectDelay = 30000;
    this.shouldReconnect = true;
    this.connect();
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('Connected');
      this.reconnectDelay = 1000;
      if (this.options.onOpen) this.options.onOpen(this);
    };
    
    this.ws.onmessage = (event) => {
      if (this.options.onMessage) {
        this.options.onMessage(JSON.parse(event.data));
      }
    };
    
    this.ws.onclose = () => {
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(), this.reconnectDelay);
        this.reconnectDelay = Math.min(
          this.reconnectDelay * 2,
          this.maxReconnectDelay
        );
      }
    };
  }
  
  send(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
  
  close() {
    this.shouldReconnect = false;
    this.ws.close();
  }
}
```

### Buffer Updates for UI

```javascript
class UpdateBuffer {
  constructor(flushInterval = 100) {
    this.buffer = [];
    this.flushInterval = flushInterval;
    this.timer = null;
  }
  
  add(update) {
    this.buffer.push(update);
    
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.flush();
      }, this.flushInterval);
    }
  }
  
  flush() {
    if (this.buffer.length > 0) {
      // Process all buffered updates at once
      this.onFlush(this.buffer);
      this.buffer = [];
    }
    this.timer = null;
  }
  
  onFlush(updates) {
    // Override this method
  }
}

const buffer = new UpdateBuffer();
buffer.onFlush = (updates) => {
  // Batch update UI
  updates.forEach(update => {
    updateDriverDisplay(update);
  });
};

ws.onmessage = (event) => {
  buffer.add(JSON.parse(event.data));
};
```

## Data Processing

### Use Streaming for Large Datasets

```javascript
const { pipeline } = require('stream/promises');
const { Transform } = require('stream');

async function processLargeDataset(sessionId) {
  const response = await fetch(
    `https://api.t1f1.com/v1/telemetry/historical?session=${sessionId}`,
    { headers: { 'Authorization': `Bearer ${API_KEY}` } }
  );
  
  const processStream = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      // Process each telemetry point
      const processed = processPoint(chunk);
      callback(null, processed);
    }
  });
  
  await pipeline(
    response.body,
    processStream,
    saveToFile
  );
}
```

### Batch API Requests

```javascript
// ❌ Bad - Sequential requests
for (const driver of drivers) {
  const data = await client.telemetry.get(driver);
  process(data);
}

// ✅ Good - Parallel requests
const results = await Promise.all(
  drivers.map(driver => client.telemetry.get(driver))
);
results.forEach(process);
```

## Logging & Monitoring

### Log API Interactions

```javascript
class APILogger {
  log(method, endpoint, status, duration) {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      method,
      endpoint,
      status,
      duration_ms: duration
    }));
  }
}

const logger = new APILogger();

async function makeRequest(url, options) {
  const start = Date.now();
  
  try {
    const response = await fetch(url, options);
    logger.log('GET', url, response.status, Date.now() - start);
    return response;
  } catch (error) {
    logger.log('GET', url, 'ERROR', Date.now() - start);
    throw error;
  }
}
```

### Monitor Performance

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      totalDuration: 0
    };
  }
  
  recordRequest(duration, error = false) {
    this.metrics.requests++;
    this.metrics.totalDuration += duration;
    if (error) this.metrics.errors++;
  }
  
  getStats() {
    return {
      total_requests: this.metrics.requests,
      error_rate: (this.metrics.errors / this.metrics.requests * 100).toFixed(2) + '%',
      avg_duration: (this.metrics.totalDuration / this.metrics.requests).toFixed(2) + 'ms'
    };
  }
}
```

## Testing

### Mock API Responses

```javascript
class MockT1Client {
  async telemetry.getLive() {
    return {
      driver: 'VER',
      speed: 312,
      gear: 8,
      throttle: 100
    };
  }
}

// Use in tests
const client = process.env.NODE_ENV === 'test' 
  ? new MockT1Client()
  : new T1ApiClient({ apiKey: process.env.T1API_KEY });
```

### Integration Tests

```javascript
describe('T1API Integration', () => {
  it('should fetch live telemetry', async () => {
    const client = new T1ApiClient({ apiKey: TEST_API_KEY });
    const telemetry = await client.telemetry.getLive();
    
    expect(telemetry).toHaveProperty('driver');
    expect(telemetry).toHaveProperty('speed');
    expect(telemetry.speed).toBeGreaterThan(0);
  });
});
```

## Documentation

### Document Your Integration

```javascript
/**
 * Fetches and processes telemetry data for analysis
 * 
 * @param {string} sessionId - The F1 session identifier
 * @param {string[]} drivers - Array of driver codes to analyze
 * @returns {Promise<AnalysisResult>} Processed telemetry analysis
 * 
 * @example
 * const analysis = await analyzeTelemetry(
 *   '2025_round05_race',
 *   ['VER', 'HAM']
 * );
 */
async function analyzeTelemetry(sessionId, drivers) {
  // Implementation
}
```

## Deployment

### Environment Configuration

```javascript
// config.js
module.exports = {
  apiKey: process.env.T1API_KEY,
  apiBaseUrl: process.env.T1API_BASE_URL || 'https://api.t1f1.com/v1',
  streamUrl: process.env.T1API_STREAM_URL || 'wss://stream.t1f1.com/v1',
  cacheEnabled: process.env.CACHE_ENABLED !== 'false',
  logLevel: process.env.LOG_LEVEL || 'info'
};
```

### Health Checks

```javascript
async function healthCheck() {
  try {
    const response = await fetch('https://api.t1f1.com/v1/health');
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Regular health checks
setInterval(async () => {
  const healthy = await healthCheck();
  console.log(`API Health: ${healthy ? 'OK' : 'DOWN'}`);
}, 60000);
```

## Support

Need help implementing these best practices?

- 📧 [developers@t1f1.com](mailto:developers@t1f1.com)
- 💬 [Discord #best-practices](https://discord.gg/turnone)
- 📚 [Code Examples](/docs/examples)
