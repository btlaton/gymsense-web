'use client';

import { Header, Footer } from '@/components/layout';
import {
  HeroSection,
  CaseStudyCard,
  FeatureSection,
  FeatureBlockSection,
  CTASection,
} from '@/components/sections';

// Feature block data - 4 blocks, each with 2 subsections
const featureBlocks = [
  {
    category: 'Payments & Billing',
    categoryColor: 'emerald',
    title: 'Trusted financial infrastructure',
    description: "Built on Stripe Connect. Process payments, manage subscriptions, and handle billing with the same infrastructure used by the world's leading companies.",
    subSections: [
      {
        title: 'Billing and payments powered by Stripe',
        description: 'Accept credit cards, ACH, and Apple Pay with enterprise-grade security. Automatic invoicing, failed payment recovery, and real-time payout tracking—all handled for you.',
        imagePlaceholder: 'Stripe Integration',
      },
      {
        title: 'Hardware-free transactions',
        description: 'No terminals, no dongles, no monthly fees. Members pay with their phones using secure QR codes. Staff complete transactions in seconds, not minutes.',
        imagePlaceholder: 'QR Payment Flow',
      },
    ] as [{ title: string; description: string; imagePlaceholder: string }, { title: string; description: string; imagePlaceholder: string }],
  },
  {
    category: 'Member Experience',
    categoryColor: 'blue',
    title: 'Frictionless interactions',
    description: 'Every touchpoint designed to be instant and intuitive. From check-in to checkout, members never wait or wonder what to do next.',
    subSections: [
      {
        title: 'Touchless member check-ins',
        description: 'Members scan a QR code at the door with their phone—no cards to swipe, no apps to fumble with. Check-in takes under 2 seconds and works every time.',
        imagePlaceholder: 'Check-in Flow',
      },
      {
        title: 'Instant app-to-app updates',
        description: 'Schedule a session, make a purchase, update a membership—changes sync instantly between staff and member apps. No refresh buttons, no waiting.',
        imagePlaceholder: 'Real-time Sync',
      },
    ] as [{ title: string; description: string; imagePlaceholder: string }, { title: string; description: string; imagePlaceholder: string }],
  },
  {
    category: 'Insights & Analytics',
    categoryColor: 'purple',
    title: 'Actionable insights, not static reports',
    description: 'Real-time dashboards that surface what matters. Understand member behavior, revenue trends, and operational health at a glance.',
    subSections: [
      {
        title: 'LTV-based customer analytics',
        description: 'See which members drive revenue and which are at risk of churning. Track lifetime value, visit frequency, and spending patterns to make smarter business decisions.',
        imagePlaceholder: 'Customer LTV Dashboard',
      },
      {
        title: 'Real-time view of transactions and payouts',
        description: 'Know exactly what you earned today, this week, or this month. Track pending payouts, refunds, and failed payments without digging through spreadsheets.',
        imagePlaceholder: 'Revenue Dashboard',
      },
    ] as [{ title: string; description: string; imagePlaceholder: string }, { title: string; description: string; imagePlaceholder: string }],
  },
  {
    category: 'Operations',
    categoryColor: 'orange',
    title: 'Enterprise-grade ops management',
    description: "Staff scheduling, session management, inventory tracking, and more. Everything you need to run a gym, nothing you don't.",
    subSections: [
      {
        title: 'Self-service product catalog',
        description: 'Add products, set prices, and start selling in seconds. AI-generated images, automatic Stripe sync, and flexible pricing—no developer needed.',
        imagePlaceholder: 'Product Management',
      },
      {
        title: 'Role-based app permissions',
        description: 'Give trainers access to scheduling, staff access to the shop, and admins access to everything. Each role sees only what they need, nothing more.',
        imagePlaceholder: 'Team Permissions',
      },
    ] as [{ title: string; description: string; imagePlaceholder: string }, { title: string; description: string; imagePlaceholder: string }],
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero - Full viewport with headline, subtitle, CTAs, and app mockup */}
        <HeroSection />

        {/* Case Study - Atlas Gym transition from Mindbody */}
        <CaseStudyCard />

        {/* Features - "Built for modern gyms and studios" with card carousel */}
        <FeatureSection />

        {/* Feature Blocks - 4 large sections like Linear */}
        {featureBlocks.map((block) => (
          <FeatureBlockSection
            key={block.category}
            category={block.category}
            categoryColor={block.categoryColor}
            title={block.title}
            description={block.description}
            subSections={block.subSections}
          />
        ))}

        {/* Pre-footer CTA - Final call to action */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
