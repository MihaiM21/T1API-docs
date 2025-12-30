# Rate Limits

T1API implements rate limiting to ensure fair usage and maintain service quality for all users.

## Rate Limit Tiers

### Free Tier

- **Requests per minute**: 100
- **Concurrent WebSocket connections**: 1
- **Historical data retention**: 30 days
- **Best for**: Personal projects, testing, development

### Pro Tier

- **Requests per minute**: 1,000
- **Concurrent WebSocket connections**: 5
- **Historical data retention**: 1 year
- **Best for**: Production applications, small teams

### Enterprise Tier

- **Requests per minute**: Custom (negotiable)
- **Concurrent WebSocket connections**: Unlimited
- **Historical data retention**: Full history
- **Dedicated support**: 24/7
- **Best for**: Large-scale applications, professional teams

## Rate Limit Headers

Every API response includes rate limit information in the headers:

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1704067200
X-RateLimit-Reset-After: 45
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Total requests allowed per window |
| `X-RateLimit-Remaining` | Requests remaining in current window |
| `X-RateLimit-Reset` | Unix timestamp when limit resets |
| `X-RateLimit-Reset-After` | Seconds until limit resets |

## Handling Rate Limits

### 429 Response

When you exceed the rate limit, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "You have exceeded your rate limit",
    "status": 429,
    "details": {
      "limit": 1000,
      "reset_at": "2025-12-30T11:00:00Z",
      "retry_after": 45
    }
  }
}
```

### Exponential Backoff

Implement exponential backoff when hitting rate limits:

```javascript
async function fetchWithBackoff(url, options, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get('X-RateLimit-Reset-After') || 
          Math.pow(2, i)
        );
        
        console.log(`Rate limited. Retrying in ${retryAfter}s...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}
```

### Python Example

```python
import time
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

def create_session_with_retries():
    session = requests.Session()
    
    retry = Retry(
        total=5,
        status_forcelist=[429, 500, 502, 503, 504],
        backoff_factor=1,
        respect_retry_after_header=True
    )
    
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    
    return session

session = create_session_with_retries()
response = session.get('https://api.t1f1.com/v1/sessions/current', 
                      headers={'Authorization': f'Bearer {API_KEY}'})
```

## Best Practices

### 1. Cache Responses

Cache API responses that don't change frequently:

```javascript
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

async function getCachedData(endpoint) {
  const cached = cache.get(endpoint);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const response = await fetch(endpoint, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  
  const data = await response.json();
  cache.set(endpoint, { data, timestamp: Date.now() });
  
  return data;
}
```

### 2. Batch Requests

Combine multiple queries when possible:

```javascript
// ❌ Bad - Multiple requests
const driver1 = await client.drivers.get('VER');
const driver2 = await client.drivers.get('HAM');
const driver3 = await client.drivers.get('LEC');

// ✅ Good - Single request
const drivers = await client.drivers.list();
const [driver1, driver2, driver3] = drivers.filter(d => 
  ['VER', 'HAM', 'LEC'].includes(d.code)
);
```

### 3. Use WebSockets for Real-Time Data

For frequently updating data, use WebSocket streams instead of polling:

```javascript
// ❌ Bad - Polling every second
setInterval(async () => {
  const telemetry = await client.telemetry.getLive();
  updateUI(telemetry);
}, 1000);

// ✅ Good - WebSocket stream
const stream = client.telemetry.stream();
stream.on('update', (telemetry) => {
  updateUI(telemetry);
});
```

### 4. Monitor Rate Limit Headers

Track your usage to avoid hitting limits:

```javascript
class RateLimitMonitor {
  constructor() {
    this.remaining = null;
    this.resetAt = null;
  }
  
  updateFromHeaders(headers) {
    this.remaining = parseInt(headers.get('X-RateLimit-Remaining'));
    this.resetAt = parseInt(headers.get('X-RateLimit-Reset'));
  }
  
  shouldThrottle() {
    if (!this.remaining) return false;
    
    // Throttle if less than 10% remaining
    return this.remaining < (this.limit * 0.1);
  }
  
  async waitIfNeeded() {
    if (this.shouldThrottle()) {
      const waitTime = this.resetAt - Math.floor(Date.now() / 1000);
      console.log(`Throttling for ${waitTime}s`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
    }
  }
}

const monitor = new RateLimitMonitor();

async function makeRequest(url) {
  await monitor.waitIfNeeded();
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  
  monitor.updateFromHeaders(response.headers);
  return response.json();
}
```

### 5. Request Only What You Need

Use field selection to reduce payload size:

```javascript
// ❌ Bad - Fetches all fields
const telemetry = await client.telemetry.getLive();

// ✅ Good - Only fetch needed fields
const telemetry = await client.telemetry.getLive({
  fields: 'speed,gear,throttle,brake'
});
```

## Endpoint-Specific Limits

Some endpoints have stricter limits:

| Endpoint | Limit | Notes |
|----------|-------|-------|
| `/telemetry/live` | 60/min | Use WebSocket for real-time |
| `/telemetry/historical` | 100/min | Cache results |
| `/sessions/*` | 1000/min | Standard limit |
| `/lap-data` | 100/min | Large datasets |
| `/weather/*` | 1000/min | Standard limit |

## Upgrading Your Tier

Need higher limits? [Upgrade your plan](https://turnonehub.com/pricing) or [contact sales](mailto:sales@t1f1.com) for enterprise options.

## Fair Use Policy

While we provide generous rate limits, please ensure your usage is fair:

- ✅ **Do**: Cache responses, use WebSockets for real-time data, batch requests
- ❌ **Don't**: Hammer endpoints, scrape all data, circumvent rate limits

Abuse of the API may result in temporary or permanent suspension of your account.

## Monitoring Your Usage

View your usage statistics in the dashboard:

1. Log in to [turnonehub.com](https://turnonehub.com)
2. Navigate to **Dashboard** → **Usage**
3. View requests, rate limit history, and trends

## Support

Questions about rate limits?

- 📧 [support@t1f1.com](mailto:support@t1f1.com)
- 💬 [Discord #support](https://discord.gg/turnone)
- 📊 [Status Page](https://status.t1f1.com)
