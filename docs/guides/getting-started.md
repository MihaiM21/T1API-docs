# Getting Started with T1API

Welcome to the T1API documentation! This guide will help you get up and running with our Formula One telemetry API in just a few minutes.

## What is T1API?

T1API is a professional-grade API that provides access to Formula One telemetry data, including real-time race data, historical statistics, driver information, lap times, and comprehensive race analysis tools.

## Prerequisites

Before you begin, make sure you have:

- An API key (sign up at [turnonehub.com](https://turnonehub.com))
- Basic knowledge of REST APIs
- A programming environment (we support Python, JavaScript, TypeScript, and more)

## Quick Start

### 1. Get Your API Key

Sign up for a T1API account and generate your API key from the dashboard:

1. Visit [turnonehub.com/register](https://turnonehub.com)
2. Complete the registration process
3. Navigate to **Dashboard** → **API Keys**
4. Click **Generate New Key**
5. Copy your API key (keep it secure!)

### 2. Make Your First Request

Here's a simple example to fetch the current session information:

```javascript
const API_KEY = 'your_api_key_here';

fetch('https://api.t1f1.com/v1/sessions/current', {
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => {
    console.log('Current Session:', data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### 3. Python Example

```python
import requests

API_KEY = 'your_api_key_here'
BASE_URL = 'https://api.t1f1.com/v1'

headers = {
    'Authorization': f'Bearer {API_KEY}',
    'Content-Type': 'application/json'
}

# Get current session
response = requests.get(f'{BASE_URL}/sessions/current', headers=headers)
session = response.json()

print(f"Current Session: {session['name']}")
print(f"Circuit: {session['circuit']}")
```

## API Base URL

All API requests should be made to:

```
https://api.t1f1.com/v1
```

## Authentication

T1API uses Bearer token authentication. Include your API key in the `Authorization` header of every request:

```http
Authorization: Bearer YOUR_API_KEY
```

## Rate Limits

Free tier: 100 requests per minute
Pro tier: 1,000 requests per minute
Enterprise: Custom limits

See [Rate Limits](/docs/guides/rate-limits) for more information.

## Next Steps

- 📖 [Authentication Guide](/docs/guides/authentication) - Learn about authentication methods
- 🚀 [Quick Start Tutorial](/docs/guides/quick-start) - Build your first application
- 📚 [API Reference](/docs/api/overview) - Explore all available endpoints
- 💡 [Examples](/docs/examples) - View code examples in multiple languages

## Need Help?

- 📧 Email: [contact@t1f1.com](mailto:contact@t1f1.com)
- 💬 Discord: [Join our community](https://discord.gg/turnone)
- 🐛 Issues: [GitHub Issues](https://github.com/turnone/t1api/issues)

Happy coding! 🏎️💨
