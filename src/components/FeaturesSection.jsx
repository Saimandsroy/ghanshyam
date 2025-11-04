import React from 'react';
import { DollarSign, Clock, FileText, HelpCircle, Lock, Heart } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      title: 'Continuous Revenue',
      description: 'Regular flow of orders to websites with quality traffic. Make upwards of $500 every month with consistent brand deals.',
      icon: DollarSign,
      color: 'rgba(107, 240, 255, 0.1)'
    },
    {
      title: 'Secure & Timely Payouts',
      description: 'Request payments whenever you want. Get paid within 24 hours, no waiting for scheduled payment dates.',
      icon: Clock,
      color: 'rgba(62, 217, 235, 0.1)'
    },
    {
      title: 'High-Quality Content',
      description: 'SEO-optimized content that adds authority to your website. No compromise on quality standards.',
      icon: FileText,
      color: 'rgba(107, 240, 255, 0.1)'
    },
    {
      title: 'Instant Support',
      description: 'Accept or reject orders based on your preferences. You have full control over what appears on your site.',
      icon: HelpCircle,
      color: 'rgba(62, 217, 235, 0.1)'
    },
    {
      title: 'Decentralised Control',
      description: "You're in the driver's seat. Accept or reject orders you're not comfortable with, unlike other platforms.",
      icon: Lock,
      color: 'rgba(107, 240, 255, 0.1)'
    },
    {
      title: 'Long Term Partnership',
      description: "Building the largest ecosystem of publishers for the long run. Committed to nurturing lasting relationships.",
      icon: Heart,
      color: 'rgba(62, 217, 235, 0.1)'
    }
  ];

  return (
    <section 
      id="features"
      className="py-20 md:py-32"
      style={{ backgroundColor: 'var(--background-dark)' }}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Why Publishers Choose{' '}
            <span className="gradient-text">LinkMag</span>
          </h2>
          <p 
            className="text-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            Everything you need to monetize your content and grow your revenue
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="card transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-md group"
                style={{
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-cyan)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                {/* Icon Container */}
                <div 
                  className="inline-flex p-3 rounded-lg mb-4"
                  style={{ backgroundColor: feature.color }}
                >
                  <Icon 
                    size={24} 
                    style={{ color: 'var(--primary-cyan)' }}
                  />
                </div>

                {/* Title */}
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
