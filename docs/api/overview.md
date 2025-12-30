# API Overview

The T1API provides comprehensive access to Formula One telemetry data through a RESTful API and WebSocket streams. This page provides an overview of the API architecture and available endpoints.

## Base URL

```
https://api.t1f1.com/v1
```

## API Versioning

T1API uses URL versioning. The current version is `v1`. All endpoints are prefixed with `/v1/`.

When we release breaking changes, we'll introduce a new version (e.g., `/v2/`) while maintaining support for older versions.

## Response Format

All API responses are in JSON format with a consistent structure:

### Successful Response

```json
{
  "data": {
    // Response data here
  },
  "meta": {
    "timestamp": "2025-12-30T10:30:00Z",
    "request_id": "req_abc123"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "invalid_request",
    "message": "The requested resource was not found",
    "status": 404,
    "details": {
      // Additional error context
    }
  },
  "meta": {
    "timestamp": "2025-12-30T10:30:00Z",
    "request_id": "req_abc123"
  }
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | OK - Request successful |
| `201` | Created - Resource created successfully |
| `204` | No Content - Request successful, no content returned |
| `400` | Bad Request - Invalid request parameters |
| `401` | Unauthorized - Invalid or missing API key |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource not found |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error - Server error |
| `503` | Service Unavailable - Temporary server issue |

## Rate Limiting

All API requests are rate limited. Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1704067200
```

When you exceed the rate limit, you'll receive a `429` status code:

```json
{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "You have exceeded your rate limit",
    "status": 429,
    "details": {
      "limit": 1000,
      "reset_at": "2025-12-30T11:00:00Z"
    }
  }
}
```

See [Rate Limits](/docs/guides/rate-limits) for more details.

## Pagination

Endpoints that return lists support pagination using `limit` and `offset` parameters:

```http
GET /v1/drivers?limit=20&offset=0
```

Paginated responses include metadata:

```json
{
  "data": [
    // Array of items
  ],
  "meta": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "has_more": true
  }
}
```

## Filtering and Sorting

Many endpoints support filtering and sorting:

```http
GET /v1/lap-data?driver=VER&session=Q3&sort=lap_time:asc
```

Common query parameters:

- `filter[field]` - Filter by field value
- `sort` - Sort results (format: `field:asc` or `field:desc`)
- `fields` - Select specific fields to return

## Timestamps

All timestamps are in ISO 8601 format with UTC timezone:

```json
{
  "timestamp": "2025-12-30T10:30:00.000Z"
}
```

## API Endpoints Overview

### Sessions

<span class="api-method api-method--get">GET</span> `/sessions/current` - Get current session
<span class="api-method api-method--get">GET</span> `/sessions/{session_id}` - Get session details
<span class="api-method api-method--get">GET</span> `/sessions` - List all sessions

[View Sessions API](/docs/api/sessions)

### Telemetry

<span class="api-method api-method--get">GET</span> `/telemetry/live` - Get live telemetry data
<span class="api-method api-method--get">GET</span> `/telemetry/{driver_id}` - Get driver telemetry
<span class="api-method api-method--get">GET</span> `/telemetry/historical` - Query historical telemetry

[View Telemetry API](/docs/api/telemetry)

### Drivers

<span class="api-method api-method--get">GET</span> `/drivers` - List all drivers
<span class="api-method api-method--get">GET</span> `/drivers/{driver_id}` - Get driver details
<span class="api-method api-method--get">GET</span> `/drivers/standings` - Get driver standings

[View Drivers API](/docs/api/drivers)

### Lap Data

<span class="api-method api-method--get">GET</span> `/lap-data` - Query lap times
<span class="api-method api-method--get">GET</span> `/lap-data/{lap_id}` - Get lap details
<span class="api-method api-method--get">GET</span> `/lap-data/fastest` - Get fastest laps

[View Lap Data API](/docs/api/lap-data)

### Weather

<span class="api-method api-method--get">GET</span> `/weather/current` - Get current weather
<span class="api-method api-method--get">GET</span> `/weather/historical` - Query historical weather

[View Weather API](/docs/api/weather)

## WebSocket Streams

For real-time data, use WebSocket connections:

```
wss://stream.t1f1.com/v1/telemetry?key=YOUR_API_KEY
```

Available streams:

- `/telemetry` - Live telemetry data
- `/timing` - Live timing data
- `/positions` - Live position updates
- `/weather` - Live weather updates

See [Streaming Data](/docs/guides/streaming-data) for details.

## SDK and Libraries

Official SDKs:

- **JavaScript/TypeScript**: `npm install @t1api/client`
- **Python**: `pip install t1api`
- **Go**: `go get github.com/turnone/t1api-go`

Community libraries available for other languages.

## API Changelog

Stay updated with API changes:

- [API Changelog](https://turnonehub.com/changelog)
- [Breaking Changes](https://turnonehub.com/breaking-changes)
- [Deprecation Policy](https://turnonehub.com/deprecation)

## Support

- 📧 API Issues: [api-support@t1f1.com](mailto:api-support@t1f1.com)
- 📚 Documentation Issues: [docs@t1f1.com](mailto:docs@t1f1.com)
- 💬 Community: [Discord](https://discord.gg/turnone)
- 🐛 Bug Reports: [GitHub Issues](https://github.com/turnone/t1api/issues)

## Next Steps

- [Authentication](/docs/guides/authentication) - Learn about API authentication
- [Telemetry API](/docs/api/telemetry) - Access real-time telemetry
- [Code Examples](/docs/examples) - View practical examples
- [Best Practices](/docs/guides/best-practices) - Optimize your integration
