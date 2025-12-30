# T1API Documentation Site

Modern, comprehensive documentation for the Turn One Formula One Telemetry API.

## 🏎️ About

This is the official documentation site for T1API - a professional-grade API providing access to Formula One telemetry data, race analysis, and historical statistics.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Serve production build
npm run serve
```

## 📁 Project Structure

```
T1API_docsSite/
├── docs/                      # Documentation markdown files
│   ├── api/                   # API reference
│   │   ├── overview.md
│   │   ├── telemetry.md
│   │   ├── sessions.md
│   │   ├── drivers.md
│   │   ├── lap-data.md
│   │   └── weather.md
│   ├── guides/                # How-to guides
│   │   ├── getting-started.md
│   │   ├── authentication.md
│   │   ├── quick-start.md
│   │   ├── streaming-data.md
│   │   ├── historical-data.md
│   │   ├── rate-limits.md
│   │   └── best-practices.md
│   ├── analysis/              # Data analysis guides
│   │   ├── telemetry-basics.md
│   │   ├── lap-comparison.md
│   │   ├── sector-analysis.md
│   │   └── tire-strategy.md
│   ├── examples.md            # Code examples
│   └── faq.md                 # FAQ
├── src/                       # Source files
│   ├── css/
│   │   └── custom.css         # Custom styling
│   └── pages/
│       └── index.tsx          # Landing page
├── static/                    # Static assets
│   └── img/
├── docusaurus.config.ts       # Docusaurus configuration
├── sidebars.ts                # Sidebar configuration
└── package.json
```

## 🎨 Features

- **Modern Design**: F1-inspired racing theme with red accent colors
- **Dark/Light Mode**: Toggle between themes
- **Responsive**: Works on all devices
- **Fast Search**: Built-in documentation search
- **Code Highlighting**: Syntax highlighting for multiple languages
- **API Method Badges**: Visual indicators for HTTP methods
- **Interactive Examples**: Live code examples
- **Comprehensive**: Complete API reference and guides

## 🎨 Customization

### Theme Colors

The site uses a Formula One-inspired color scheme defined in `src/css/custom.css`:

- Primary: `#e10600` (F1 Red)
- Dark Background: `#0f0f14`
- Surface: `#15151e`

### Configuration

Main configuration is in `docusaurus.config.ts`:

```typescript
{
  title: 'T1API Documentation',
  tagline: 'Professional Formula One Telemetry Analysis API',
  url: 'https://docs.t1f1.com',
  // ...
}
```

## 📝 Writing Documentation

### Creating New Pages

1. Create a new `.md` file in the appropriate directory under `docs/`
2. Add frontmatter (optional):

```markdown
---
sidebar_position: 1
title: My Page Title
---

# Content here
```

3. Update `sidebars.ts` to include your new page

### Markdown Features

Docusaurus supports:

- Standard Markdown
- MDX (JSX in Markdown)
- Code blocks with syntax highlighting
- Admonitions (notes, warnings, tips)
- Tabs
- And more!

Example:

```markdown
:::tip Pro Tip
Use WebSockets for real-time data!
:::

\`\`\`javascript
const client = new T1ApiClient({ apiKey: 'YOUR_KEY' });
\`\`\`
```

## 🚀 Deployment

### Build

```bash
npm run build
```

This generates a `build/` directory with static files.

### Deploy

Deploy the `build/` directory to any static hosting service:

- **Netlify**: Connect your repo and deploy automatically
- **Vercel**: Import project and deploy
- **GitHub Pages**: Use GitHub Actions
- **AWS S3**: Upload build folder
- **Azure Static Web Apps**: Deploy via portal

### Environment Variables

For production, set:

```bash
URL=https://docs.t1f1.com
BASE_URL=/
```

## 🛠️ Development

### Local Development

```bash
npm start
```

Opens browser to `http://localhost:3000`

### Adding Search

For production search, integrate:

- Algolia DocSearch (free for open source)
- Local search plugin
- Custom search solution

### Analytics

Add Google Analytics or other analytics in `docusaurus.config.ts`:

```typescript
gtag: {
  trackingID: 'G-XXXXXXXXXX',
},
```

## 📦 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build locally
- `npm run clear` - Clear cache
- `npm run typecheck` - Run TypeScript type checking

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📚 Resources

- [Docusaurus Documentation](https://docusaurus.io/)
- [Markdown Guide](https://www.markdownguide.org/)
- [MDX Documentation](https://mdxjs.com/)
- [Turn One Hub](https://turnonehub.com)

## 📄 License

This documentation is © 2025 Turn One. All rights reserved.

## 💬 Support

- 📧 Email: [docs@t1f1.com](mailto:docs@t1f1.com)
- 💬 Discord: [Join our community](https://discord.gg/turnone)
- 🐙 GitHub: [Issues](https://github.com/turnone/t1api-docs/issues)

---

Built with ❤️ and ⚡ by the Turn One team
