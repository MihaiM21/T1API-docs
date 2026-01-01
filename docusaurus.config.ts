import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'T1API Documentation',
  tagline: 'Professional Formula One Telemetry Analysis API',
  favicon: 'img/favicon.ico',

  url: 'https://docs.t1f1.com',
  baseUrl: '/',

  organizationName: 'TurnOne',
  projectName: 't1api-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: undefined,
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en"],
        highlightSearchTermsOnTargetPage: true,
        indexBlog: false,
        indexDocs: true,
        indexPages: true,
        docsRouteBasePath: '/docs',
      },
    ],
  ],

  themeConfig: {
    image: 'img/logo.png',
    navbar: {
      title: '',
      logo: {
        alt: 'Turn One Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/docs/guides/getting-started',
          label: 'Getting Started',
          position: 'left',
        },
        {
          href: 'https://turnonehub.com',
          label: 'Turn One Hub',
          position: 'right',
        },
        {
          href: 'https://github.com/MihaiM21/Turn-One',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/guides/getting-started',
            },
            {
              label: 'API Reference',
              to: '/docs/api/overview',
            },
            {
              label: 'Examples',
              to: '/docs/examples',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/turnoneofficial',
            },
            {
              label: 'Instagram',
              href: 'https://www.instagram.com/turnoneofficial/',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/channel/UCg-DYx-XQUFeEol-IHmCi_Q/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Turn One Hub',
              href: 'https://turnonehub.com',
            },
            {
              label: 'Contact',
              href: 'mailto:contact@t1f1.com',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/MihaiM21/Turn-One',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Turn One. All rights reserved. | v0.3.0`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'javascript', 'typescript', 'json', 'bash'],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    // announcementBar: {
    //   id: 'support_us',
    //   content:
    //     '⭐️ Star us on <a target="_blank" rel="noopener noreferrer" href="https://github.com/turnone">GitHub</a> | Join our community for F1 telemetry insights!',
    //   backgroundColor: '#e10600',
    //   textColor: '#ffffff',
    //   isCloseable: true,
    // },
  } satisfies Preset.ThemeConfig,
};

export default config;
