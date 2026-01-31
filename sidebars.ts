import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  // Get Started Sidebar
  getStartedSidebar: [
    {
      type: 'category',
      label: 'Get Started',
      collapsed: false,
      items: [
        'get-started/introduction',
        'get-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Quickstarts',
      collapsed: false,
      items: [
        'get-started/quickstarts/gateway',
        'get-started/quickstarts/python-sdk',
        'get-started/quickstarts/nodejs-sdk',
      ],
    },
    {
      type: 'category',
      label: 'Gateway Providers',
      collapsed: false,
      items: [
        'gateway/overview',
        'gateway/anthropic',
        'gateway/google-gemini',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: true,
      items: [
        'concepts/gateway-vs-sdk',
        'concepts/agents',
        'concepts/sessions',
        'concepts/policies',
        'concepts/detections',
      ],
    },
  ],

  // API Reference Sidebar
  apiSidebar: [
    {
      type: 'category',
      label: 'API Reference',
      collapsed: false,
      items: [
        'api-reference/overview',
        'api-reference/authentication',
        'api-reference/rate-limits',
        'api-reference/errors',
      ],
    },
    {
      type: 'category',
      label: 'Endpoints',
      collapsed: false,
      items: [
        'api-reference/observe',
        'api-reference/enforce',
        'api-reference/sessions',
        'api-reference/traces',
        'api-reference/agents',
        'api-reference/export',
      ],
    },
  ],

  // SDKs Sidebar
  sdkSidebar: [
    {
      type: 'category',
      label: 'Integration Overview',
      collapsed: false,
      items: [
        'sdks/overview',
      ],
    },
    {
      type: 'category',
      label: 'SDKs',
      collapsed: false,
      items: [
        'sdks/python',
        'sdks/nodejs',
      ],
    },
    {
      type: 'category',
      label: 'CLI',
      collapsed: false,
      items: [
        'cli/overview',
      ],
    },
    {
      type: 'category',
      label: 'Frameworks',
      collapsed: false,
      items: [
        'frameworks/overview',
        'frameworks/langchain',
        'frameworks/crewai',
        'frameworks/autogen',
        'frameworks/llamaindex',
      ],
    },
  ],

  // Resources Sidebar
  resourcesSidebar: [
    {
      type: 'category',
      label: 'Compliance',
      collapsed: false,
      items: [
        'compliance/overview',
        'compliance/owasp-agentic',
        'compliance/eu-ai-act',
        'compliance/nist-ai-rmf',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/production-checklist',
        'guides/security-best-practices',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/detections',
        'reference/policy-types',
        'reference/error-codes',
        'reference/glossary',
      ],
    },
    'changelog',
  ],
};

export default sidebars;
