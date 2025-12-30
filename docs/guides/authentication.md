# Authentication

T1API uses API key authentication to secure access to our endpoints. This guide covers everything you need to know about authenticating your requests.

## API Keys

### Obtaining an API Key

1. Create an account at [turnonehub.com](https://turnonehub.com)
2. Navigate to your dashboard
3. Go to **Settings** → **API Keys**
4. Click **Create New API Key**
5. Give your key a descriptive name (e.g., "Production App", "Development")
6. Copy the generated key immediately (you won't see it again!)

:::warning Security Warning
Never commit API keys to version control or share them publicly. Store them securely using environment variables or secret management services.
:::

### Key Types

T1API supports different key types for different use cases:

| Key Type | Use Case | Rate Limit |
|----------|----------|------------|
| **Development** | Testing and development | 100 req/min |
| **Production** | Live applications | 1,000 req/min |
| **Enterprise** | High-volume applications | Custom |

## Authentication Methods

### Bearer Token (Recommended)

Include your API key in the `Authorization` header using the Bearer scheme:

```http
GET /v1/sessions/current HTTP/1.1
Host: api.t1f1.com
Authorization: Bearer your_api_key_here
Content-Type: application/json
```

#### JavaScript Example

```javascript
const API_KEY = process.env.T1API_KEY;

const response = await fetch('https://api.t1f1.com/v1/sessions/current', {
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

#### Python Example

```python
import os
import requests

API_KEY = os.environ.get('T1API_KEY')
BASE_URL = 'https://api.t1f1.com/v1'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

response = requests.get(f'{BASE_URL}/sessions/current', headers=headers)
data = response.json()
```

#### cURL Example

```bash
curl -X GET "https://api.t1f1.com/v1/sessions/current" \
  -H "Authorization: Bearer your_api_key_here" \
  -H "Content-Type: application/json"
```

## Best Practices

### 1. Use Environment Variables

Never hardcode API keys in your source code. Use environment variables instead:

```javascript
// ✅ Good
const apiKey = process.env.T1API_KEY;

// ❌ Bad
const apiKey = 'sk_live_1234567890abcdef';
```

### 2. Rotate Keys Regularly

For security, rotate your API keys periodically:

1. Generate a new key
2. Update your application to use the new key
3. Verify everything works
4. Delete the old key

### 3. Use Different Keys for Different Environments

Create separate API keys for development, staging, and production:

```bash
# .env.development
T1API_KEY=sk_dev_...

# .env.production
T1API_KEY=sk_live_...
```

### 4. Implement Key Storage Securely

For production applications, use secure secret management:

- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager
- HashiCorp Vault

## Error Handling

### Invalid API Key

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "The provided API key is invalid or has been revoked",
    "status": 401
  }
}
```

### Missing API Key

```json
{
  "error": {
    "code": "missing_authentication",
    "message": "No API key provided in the Authorization header",
    "status": 401
  }
}
```

### Expired API Key

```json
{
  "error": {
    "code": "expired_api_key",
    "message": "This API key has expired. Please generate a new one",
    "status": 401
  }
}
```

## Testing Authentication

Test your authentication setup with this simple endpoint:

```bash
curl -X GET "https://api.t1f1.com/v1/auth/verify" \
  -H "Authorization: Bearer your_api_key_here"
```

Successful response:

```json
{
  "valid": true,
  "key_type": "production",
  "rate_limit": {
    "limit": 1000,
    "remaining": 999,
    "reset": 1704067200
  }
}
```

## WebSocket Authentication

For real-time data streams, authenticate WebSocket connections:

```javascript
const ws = new WebSocket(
  `wss://stream.t1f1.com/v1/telemetry?key=${API_KEY}`
);

ws.onopen = () => {
  console.log('Connected to T1API stream');
};

ws.onmessage = (event) => {
  const telemetry = JSON.parse(event.data);
  console.log('Telemetry update:', telemetry);
};
```

## Next Steps

- [Rate Limits](/docs/guides/rate-limits) - Understand rate limiting
- [Quick Start](/docs/guides/quick-start) - Build your first app
- [API Reference](/docs/api/overview) - Explore available endpoints

## Support

Having authentication issues?

- 📧 Email: [support@t1f1.com](mailto:support@t1f1.com)
- 💬 Discord: [Join our community](https://discord.gg/turnone)
