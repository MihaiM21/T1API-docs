# Frequently Asked Questions

Common questions and answers about T1API.

## General

### What is T1API?

T1API is a professional-grade API that provides access to Formula One telemetry data, including real-time race data, historical statistics, lap times, and comprehensive race analysis tools.

### Who can use T1API?

T1API is available to:
- Motorsport enthusiasts and hobbyists
- Data analysts and researchers
- Application developers
- Professional racing teams (Enterprise tier)
- Educational institutions

### What data does T1API provide?

T1API provides:
- Real-time telemetry (speed, throttle, brake, etc.)
- Lap times and sector splits
- Driver and team information
- Session and race results
- Weather conditions
- Historical data from past seasons

## Getting Started

### How do I get an API key?

1. Sign up at [turnonehub.com](https://turnonehub.com)
2. Navigate to **Dashboard** → **API Keys**
3. Click **Generate New Key**
4. Copy and securely store your key

See [Authentication Guide](/docs/guides/authentication) for details.

### Is there a free tier?

Yes! The free tier includes:
- 100 requests per minute
- 1 WebSocket connection
- 30 days of historical data
- Access to all endpoints

### How do I upgrade my plan?

Visit [turnonehub.com/pricing](https://turnonehub.com/pricing) to view plans and upgrade. Enterprise customers should [contact sales](mailto:sales@t1f1.com).

## Technical

### What programming languages are supported?

T1API is a REST API, so it works with any language that can make HTTP requests. We provide official SDKs for:
- JavaScript/TypeScript
- Python
- Go

Community libraries exist for other languages.

### How do I handle rate limits?

See our [Rate Limits Guide](/docs/guides/rate-limits) for best practices. Key points:
- Monitor rate limit headers
- Implement exponential backoff
- Cache responses when appropriate
- Use WebSockets for real-time data

### Can I use T1API in production?

Yes! T1API is production-ready with:
- 99.9% uptime SLA (Pro and Enterprise)
- Global CDN for low latency
- Redundant infrastructure
- 24/7 monitoring

### How often is data updated?

- **Live data**: Real-time during sessions
- **Session results**: Immediately after session ends
- **Telemetry**: Available 30 minutes post-session
- **Full analysis**: Available 2 hours post-session

### What's the data refresh rate for WebSockets?

WebSocket streams operate at:
- **Low frequency**: 1Hz (1 update/second)
- **Medium frequency**: 5Hz (5 updates/second)
- **High frequency**: 10Hz (10 updates/second)

### Can I download bulk historical data?

Yes, but please:
1. Use pagination for large queries
2. Cache data locally (it doesn't change)
3. Respect rate limits
4. Consider Enterprise tier for bulk access

## Data & Accuracy

### How accurate is the telemetry data?

Our telemetry data comes from official F1 timing systems with:
- Sub-100ms latency for live data
- GPS accuracy within 1 meter
- Sensor sampling at 100Hz+

### Is this official Formula One data?

T1API aggregates data from multiple sources including official timing feeds, GPS tracking, and public APIs. We are not officially affiliated with Formula 1®.

### What seasons are available?

Historical data availability:
- **Free tier**: Current season + 30 days
- **Pro tier**: Current season + 1 year
- **Enterprise**: Full history (2018+)

### Can I access practice and qualifying data?

Yes! All session types are available:
- Free Practice 1, 2, 3
- Qualifying (Q1, Q2, Q3)
- Sprint Qualifying
- Sprint Race
- Main Race

## API Usage

### Can I use T1API in a mobile app?

Yes, but **never** expose your API key in frontend code. Instead:
1. Create a backend proxy
2. Authenticate users in your backend
3. Make T1API calls from your backend
4. Forward data to your mobile app

### Can I use T1API in a browser?

Yes, with the same security considerations as mobile apps. Use a backend proxy to protect your API key.

### How do I stream real-time data?

Use WebSocket connections:

```javascript
const ws = new WebSocket('wss://stream.t1f1.com/v1/telemetry?key=YOUR_API_KEY');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

See [Streaming Data Guide](/docs/guides/streaming-data).

### Can I make requests from the client-side?

For security reasons, we recommend:
- ✅ **Server-to-server**: API calls from your backend
- ❌ **Client-to-API**: Exposes your API key

If you must call from client-side, use a backend proxy.

### What's the maximum request size?

- **Request payload**: 1MB
- **Response payload**: 10MB (with automatic pagination)
- **WebSocket message**: 100KB

### Do you support GraphQL?

Currently, T1API is REST-only. GraphQL support is planned for future releases. Follow our [changelog](https://turnonehub.com/changelog) for updates.

## Billing & Plans

### How is usage calculated?

Usage is measured by:
- Number of API requests per minute
- Number of concurrent WebSocket connections
- Historical data retention period

### What happens if I exceed my rate limit?

You'll receive a `429 Too Many Requests` response. Your requests will be rejected until the rate limit resets (typically 60 seconds).

### Can I get a refund?

Yes, we offer a 30-day money-back guarantee on Pro and Enterprise plans.

### Do you offer educational discounts?

Yes! Students and educational institutions can get 50% off Pro plans. [Contact us](mailto:education@t1f1.com) with proof of enrollment/employment.

### What payment methods do you accept?

We accept:
- Credit cards (Visa, Mastercard, Amex)
- PayPal
- Bank transfer (Enterprise only)
- Purchase orders (Enterprise only)

## Data Privacy & Security

### How secure is my data?

T1API uses:
- TLS 1.3 encryption for all connections
- API key authentication
- Rate limiting to prevent abuse
- Regular security audits

### Do you log API requests?

We log:
- Request metadata (endpoint, timestamp, status)
- Rate limit information
- Error details for debugging

We **do not** log:
- API keys
- Request/response bodies (except for debugging with consent)

### Is my data shared with third parties?

No. Your usage data is never shared with third parties without your explicit consent.

### How do I delete my account and data?

Email [privacy@t1f1.com](mailto:privacy@t1f1.com) with your account details. We'll delete your account and associated data within 30 days per GDPR requirements.

## Support

### How do I report a bug?

Report bugs via:
- 🐛 [GitHub Issues](https://github.com/turnone/t1api/issues)
- 📧 [bugs@t1f1.com](mailto:bugs@t1f1.com)
- 💬 [Discord #bugs](https://discord.gg/turnone)

### How fast is support response time?

Response times by tier:
- **Free**: 48-72 hours (email only)
- **Pro**: 24 hours (email + Discord)
- **Enterprise**: 4 hours (24/7 support)

### Where can I request features?

Submit feature requests:
- 💡 [GitHub Discussions](https://github.com/turnone/t1api/discussions)
- 📧 [features@t1f1.com](mailto:features@t1f1.com)
- 💬 [Discord #feature-requests](https://discord.gg/turnone)

### Is there a status page?

Yes! Monitor API status at [status.t1f1.com](https://status.t1f1.com)

### How can I contribute?

We welcome contributions:
- Report bugs and issues
- Suggest features
- Share examples and tutorials
- Contribute to community libraries
- Help others on Discord

## Still Have Questions?

Can't find your answer?

- 📧 Email: [support@t1f1.com](mailto:support@t1f1.com)
- 💬 Discord: [Join our community](https://discord.gg/turnone)
- 📚 Documentation: [docs.t1f1.com](https://docs.t1f1.com)
- 🐙 GitHub: [github.com/turnone/t1api](https://github.com/turnone/t1api)
