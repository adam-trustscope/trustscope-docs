import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'TrustScope',
  tagline: 'AI Agent Governance Platform',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.trustscope.ai',
  baseUrl: '/',

  organizationName: 'trustscope-ai',
  projectName: 'docs',

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
          editUrl: 'https://github.com/adam-trustscope/trustscope-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      'docusaurus-plugin-openapi-docs',
      {
        id: 'api',
        docsPluginId: 'classic',
        config: {
          trustscope: {
            specPath: 'openapi/openapi.yaml',
            outputDir: 'docs/api-reference',
            sidebarOptions: {
              groupPathsBy: 'tag',
            },
          },
        },
      },
    ],
  ],

  themes: ['docusaurus-theme-openapi-docs'],

  themeConfig: {
    image: 'img/trustscope-social-card.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'TrustScope',
      logo: {
        alt: 'TrustScope Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'getStartedSidebar',
          position: 'left',
          label: 'Get Started',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
        },
        {
          type: 'docSidebar',
          sidebarId: 'sdkSidebar',
          position: 'left',
          label: 'SDKs',
        },
        {
          type: 'docSidebar',
          sidebarId: 'resourcesSidebar',
          position: 'left',
          label: 'Resources',
        },
        {
          href: 'https://app.trustscope.ai',
          label: 'Dashboard',
          position: 'right',
        },
        {
          href: 'https://github.com/trustscope-ai',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Get Started',
              to: '/docs/get-started/introduction',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference/overview',
            },
            {
              label: 'SDKs',
              to: '/docs/sdks/python',
            },
          ],
        },
        {
          title: 'Product',
          items: [
            {
              label: 'Dashboard',
              href: 'https://app.trustscope.ai',
            },
            {
              label: 'Pricing',
              href: 'https://trustscope.ai/pricing',
            },
            {
              label: 'Status',
              href: 'https://status.trustscope.ai',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/trustscope',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/trustscope_ai',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/trustscope-ai',
            },
          ],
        },
        {
          title: 'Company',
          items: [
            {
              label: 'About',
              href: 'https://trustscope.ai/about',
            },
            {
              label: 'Blog',
              href: 'https://trustscope.ai/blog',
            },
            {
              label: 'Contact',
              href: 'mailto:support@trustscope.ai',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} TrustScope, Inc. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'python', 'typescript', 'go', 'rust', 'java', 'yaml'],
    },
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'trustscope',
      contextualSearch: true,
      placeholder: 'Search docs...',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
