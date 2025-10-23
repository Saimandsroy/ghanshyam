import { DollarSign, Clock, FileText, HelpCircle, Lock, Heart } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      title: 'Continuous Revenue',
      description: 'We can ensure regular flow of orders to websites with quality traffic & good metrics. Ideally a bloggers can easily make upwards of $500 every month!',
      icon: <DollarSign className="h-10 w-10 text-[#6BF0FF]" />
    },
    {
      title: 'Secure & Timely Payouts',
      description: 'Unlike other platforms that have set dates for making payments, on BM publishers can request payments whenever they want. You request a payment; you get it within 24 hours.',
      icon: <Clock className="h-10 w-10 text-[#6BF0FF]" />
    },
    {
      title: 'High-Quality Content',
      description: 'We ensure high quality SEO optimised content that further add authority to your website in front of search engines. We make no compromise with content quality.',
      icon: <FileText className="h-10 w-10 text-[#6BF0FF]" />
    },
    {
      title: 'Instant Support',
      description: 'A Publisher can accept an order or reject the same depending on what they feel is right. The platform or the admin will not do anything to take the decision',
      icon: <HelpCircle className="h-10 w-10 text-[#6BF0FF]" />
    },
    {
      title: 'Decentralised Control',
      description: "At links management, its the publisher that takes the shot, unlike other platforms. You're free to accept or reject an order you're not comfortable with",
      icon: <Lock className="h-10 w-10 text-[#6BF0FF]" />
    },
    {
      title: 'Long Term Association',
      description: "At LM, we're focused on building the largest ecosystem of publishers and bloggers for the long run. And we're committed to nurturing the relationship.",
      icon: <Heart className="h-10 w-10 text-[#6BF0FF]" />
    }
  ];

  return (
    <section className="py-20 bg-[#0F1724]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#1A2233] rounded-xl shadow-lg shadow-[#2D1066]/10 p-8 transition-all duration-300 hover:shadow-xl hover:shadow-[#6BF0FF]/10 hover:-translate-y-2 border border-[#2C3445] hover:border-[#6BF0FF]/30 group">
              <div className="mb-4 bg-[#2D1066]/20 inline-flex p-3 rounded-lg group-hover:bg-[#2D1066]/40 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#6BF0FF] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-[#D1D5DB]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
