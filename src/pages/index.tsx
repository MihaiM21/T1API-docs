import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import { JSX } from 'react';

type FeatureItem = {
  title: string;
  icon: string;
description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Real-Time Telemetry',
    icon: '📡',
    description: (
      <>
        Access live Formula One telemetry data including speed, throttle, brake, 
        DRS status, and more. Stream data in real-time during races and practice sessions.
      </>
    ),
  },
  {
    title: 'Historical Data Analysis',
    icon: '📈',
    description: (
      <>
        Query comprehensive historical data from past seasons. Analyze lap times, 
        sector performance, tire strategies, and driver comparisons across multiple races.
      </>
    ),
  },
  {
    title: 'High Performance API',
    icon: '⚡',
    description: (
      <>
        Built for speed and reliability. Low-latency responses, efficient data 
        streaming, and robust infrastructure to handle high-frequency requests.
      </>
    ),
  },
  {
    title: 'Secure & Authenticated',
    icon: '🔒',
    description: (
      <>
        Enterprise-grade security with API key authentication, rate limiting, 
        and comprehensive access controls to protect your data and usage.
      </>
    ),
  },
  {
    title: 'Comprehensive Documentation',
    icon: '📖',
    description: (
      <>
        Detailed API reference, interactive examples, and step-by-step guides 
        to help you integrate T1API into your applications quickly.
      </>
    ),
  },
  {
    title: 'Developer Friendly',
    icon: '💻',
    description: (
      <>
        RESTful API design with JSON responses, SDKs for popular languages, 
        WebSocket support for real-time data, and comprehensive error handling.
      </>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  return (
    <div className="feature-card">
      <span className="feature-card__icon">{icon}</span>
      <Heading as="h3" className="feature-card__title">{title}</Heading>
      <p>{description}</p>
    </div>
  );
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          {/* <Link
            className="button button--primary button--lg"
            to="/docs/guides/getting-started">
            Get Started
          </Link> */}
          <Link
            className="button button--secondary button--lg"
            to="/docs/api/overview"
            style={{marginLeft: '0'}}>
              <span style={{color: 'aliceblue'}}>Get Started</span>
            
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - F1 Telemetry API`}
      description="Professional Formula One telemetry analysis API for real-time and historical F1 data">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="features">
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
        
        <section className={styles.codeExample}>
          <div className="container">
            <Heading as="h2" style={{textAlign: 'center', marginBottom: '3rem'}}>
              Simple, Powerful, Lightning Fast
            </Heading>
            <div className={styles.codeBlock}>
              <pre>
{`// Get live telemetry data in seconds
const response = await fetch('https://api.t1f1.com/v1/telemetry/live', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const telemetry = await response.json();

// Access real-time F1 data
console.log('Speed: ' + telemetry.speed + ' km/h');        // Current speed
console.log('Throttle: ' + telemetry.throttle + '%');      // Throttle position
console.log('Gear: ' + telemetry.gear);                    // Current gear
console.log('DRS: ' + (telemetry.drs ? 'Active' : 'Inactive'));  // DRS status`}
              </pre>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
