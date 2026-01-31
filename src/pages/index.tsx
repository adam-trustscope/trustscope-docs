import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title} Documentation
        </Heading>
        <p className="hero__subtitle">
          AI Agent Governance Platform - Observability, Security & Compliance
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/get-started/introduction">
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/docs/get-started/quickstarts/gateway"
            style={{marginLeft: '1rem'}}>
            5-Minute Quickstart
          </Link>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Gateway Integration',
    description: (
      <>
        Route LLM calls through TrustScope with 2 lines of code.
        Works with OpenAI, Anthropic, Google Gemini, and more.
      </>
    ),
    link: '/docs/get-started/quickstarts/gateway',
  },
  {
    title: 'Python & Node.js SDKs',
    description: (
      <>
        Full-featured SDKs with decorators, sessions, and policy enforcement.
        TypeScript-first Node.js support.
      </>
    ),
    link: '/docs/sdks/python',
  },
  {
    title: 'Real-time Detection',
    description: (
      <>
        Detect prompt injection, PII leakage, and policy violations
        in real-time before they reach production.
      </>
    ),
    link: '/docs/concepts/detections',
  },
  {
    title: 'Compliance Ready',
    description: (
      <>
        Generate audit trails and compliance reports for
        NIST AI RMF, EU AI Act, SOC 2, and more.
      </>
    ),
    link: '/docs/compliance/overview',
  },
];

function Feature({title, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
      <Link to={link} className={styles.featureCard}>
        <div className="padding--lg">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickstartSection(): ReactNode {
  return (
    <section className={styles.quickstart}>
      <div className="container">
        <Heading as="h2">Start Monitoring in 5 Minutes</Heading>
        <div className={styles.codeExample}>
          <pre>
            <code>{`# Before - No governance
from openai import OpenAI
client = OpenAI()

# After - Full governance (add 2 lines)
from openai import OpenAI
client = OpenAI(
    base_url="https://gateway.trustscope.ai/v1",
    default_headers={"X-TrustScope-Key": "ts_live_xxx"}
)

# Your existing code works unchanged
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)`}</code>
          </pre>
        </div>
        <div className={styles.buttons} style={{marginTop: '2rem'}}>
          <Link
            className="button button--primary button--lg"
            to="/docs/get-started/quickstarts/gateway">
            View Full Quickstart
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="AI Agent Governance Platform"
      description="TrustScope provides observability, security, and compliance for AI agents in production.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <QuickstartSection />
      </main>
    </Layout>
  );
}
