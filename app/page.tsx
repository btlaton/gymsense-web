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
    learnMoreHref: '#payments',
    subSections: [
      {
        title: 'Lorem ipsum dolor',
        description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud.',
        imagePlaceholder: 'Payments Feature 1',
      },
      {
        title: 'Consectetur adipiscing',
        description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.',
        imagePlaceholder: 'Payments Feature 2',
      },
    ] as [{ title: string; description: string; imagePlaceholder: string }, { title: string; description: string; imagePlaceholder: string }],
  },
  {
    category: 'Member Experience',
    categoryColor: 'blue',
    title: 'Frictionless interactions',
    description: 'Every touchpoint designed to be instant and intuitive. From check-in to checkout, members never wait or wonder what to do next.',
    learnMoreHref: '#member-experience',
    subSections: [
      {
        title: 'Duis aute irure dolor',
        description: 'In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat.',
        imagePlaceholder: 'Member Experience Feature 1',
      },
      {
        title: 'Sunt in culpa qui',
        description: 'Officia deserunt mollit anim id est laborum sed ut perspiciatis unde omnis iste natus error sit voluptatem.',
        imagePlaceholder: 'Member Experience Feature 2',
      },
    ] as [{ title: string; description: string; imagePlaceholder: string }, { title: string; description: string; imagePlaceholder: string }],
  },
  {
    category: 'Analytics & Reporting',
    categoryColor: 'purple',
    title: 'Actionable insights, not static reports',
    description: 'Real-time dashboards that surface what matters. Understand member behavior, revenue trends, and operational health at a glance.',
    learnMoreHref: '#analytics',
    subSections: [
      {
        title: 'Neque porro quisquam',
        description: 'Est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia non numquam eius modi.',
        imagePlaceholder: 'Analytics Feature 1',
      },
      {
        title: 'Tempora incidunt ut',
        description: 'Labore et dolore magnam aliquam quaerat voluptatem ut enim ad minima veniam quis nostrum exercitationem.',
        imagePlaceholder: 'Analytics Feature 2',
      },
    ] as [{ title: string; description: string; imagePlaceholder: string }, { title: string; description: string; imagePlaceholder: string }],
  },
  {
    category: 'Operations',
    categoryColor: 'orange',
    title: 'Enterprise-grade ops management',
    description: "Staff scheduling, session management, inventory tracking, and more. Everything you need to run a gym, nothing you don't.",
    learnMoreHref: '#operations',
    subSections: [
      {
        title: 'At vero eos et accusamus',
        description: 'Et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores.',
        imagePlaceholder: 'Operations Feature 1',
      },
      {
        title: 'Nam libero tempore',
        description: 'Cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.',
        imagePlaceholder: 'Operations Feature 2',
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
            learnMoreHref={block.learnMoreHref}
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
