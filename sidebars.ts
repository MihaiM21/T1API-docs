import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'guides/getting-started',
        'guides/authentication',
        'guides/quick-start',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
        'api/telemetry',
        'api/sessions',
        'api/drivers',
        'api/lap-data',
        'api/weather',
      ],
    },
    {
      type: 'category',
      label: 'Data Analysis',
      items: [
        'analysis/telemetry-basics',
        'analysis/lap-comparison',
        'analysis/sector-analysis',
        'analysis/tire-strategy',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/streaming-data',
        'guides/historical-data',
        'guides/rate-limits',
        'guides/best-practices',
      ],
    },
    {
      type: 'doc',
      id: 'examples',
    },
    {
      type: 'doc',
      id: 'faq',
    },
  ],
};

export default sidebars;
