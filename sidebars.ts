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
        'get-started/quick-reference',
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
        'gateway/custom-providers',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        'concepts/architecture',
        'concepts/technical-overview',
        'concepts/evidence-framework',
        'concepts/gateway-vs-sdk',
        'concepts/agents',
        'concepts/agent-dna',
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
        'sdks/react-native',
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

  // Developer Sidebar
  developerSidebar: [
    {
      type: 'category',
      label: 'Developer Handbook',
      collapsed: false,
      items: [
        'developer/overview',
        'developer/repositories',
        'developer/local-development',
        'developer/environments-and-secrets',
        'developer/deployment-runbook',
        'developer/go-live-checklist',
      ],
    },
  ],

  // Safe Mode Sidebar
  safeModeSidebar: [
    {
      type: 'category',
      label: 'Safe Mode',
      collapsed: false,
      items: [
        'safe-mode/index',
        'safe-mode/install',
        'safe-mode/presets',
        'safe-mode/knobs',
        'safe-mode/engines',
        'safe-mode/cli',
      ],
    },
  ],

  // Cloud Sidebar
  cloudSidebar: [
    {
      type: 'category',
      label: 'TrustScope Cloud',
      collapsed: false,
      items: [
        'cloud/index',
        'cloud/connect',
        'cloud/dashboard',
        'cloud/detections',
      ],
    },
    {
      type: 'category',
      label: 'Management',
      collapsed: false,
      items: [
        'cloud/policies',
        'cloud/agents',
        'cloud/team',
        'cloud/managed-endpoints',
      ],
    },
    {
      type: 'category',
      label: 'Compliance & Export',
      collapsed: false,
      items: [
        'cloud/evidence',
        'cloud/exports',
        'cloud/siem',
      ],
    },
    {
      type: 'category',
      label: 'Account',
      collapsed: false,
      items: [
        'cloud/billing',
      ],
    },
  ],

  // Resources Sidebar
  resourcesSidebar: [
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'guides/implementation',
        'guides/production-checklist',
        'guides/security-best-practices',
      ],
    },
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
