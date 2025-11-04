import { UserPlus, FileText, Link, DollarSign } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: 'Sign Up And List Your Website On LM',
      description: 'Once you signup & submit required website details, our team run through its metrics & pricing details to list it on our dashboard.',
      icon: <UserPlus className="h-10 w-10 text-white" />
    },
    {
      number: 2,
      title: 'Start Receiving Orders Details',
      description: 'Our team submits the order details that you can access through your dashbaord for further action & publishing, each time we find a relevant order to push. You get notified in your email as well.',
      icon: <FileText className="h-10 w-10 text-white" />
    },
    {
      number: 3,
      title: 'Share The Live URL On Your Dashboard',
      description: "On successful publishing, you need to close the order by submitting the Live URL on the dashboard. We'll evaluate and review for quality assurance & subsequent payment approval.",
      icon: <Link className="h-10 w-10 text-white" />
    },
    {
      number: 4,
      title: 'Request Payment Withdrawl',
      description: 'You can request for payment withdrawl using your preferred payment method, you will see the order amount reflect on your Wallet. The payment will be processed on weekly basis.',
      icon: <DollarSign className="h-10 w-10 text-white" />
    }
  ];

  return (
    <section className="py-20 bg-[#0F1724]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How does the Platform{' '}
          <span className="text-[#6BF0FF]">works for Publishers?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-9">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col relative group overflow-visible isolate">
              <div className="bg-[#2D1066] text-white text-center py-4 rounded-t-lg group-hover:bg-[#4E2C93] transition-colors duration-300 z-20 relative shadow-[0_6px_20px_rgba(77,44,147,0.35)]">
                <span className="font-bold">Step {step.number}</span>
              </div>
              <div className="bg-[#1A2233] rounded-b-lg shadow-lg p-6 flex-1 flex flex-col border border-[#2C3445] group-hover:border-[#6BF0FF]/30 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(107,240,255,0.2)] overflow-visible">
                <div className="bg-[#2D1066] w-16 h-16 rounded-full flex items-center justify-center mx-auto -mt-10 mb-6 shadow-lg group-hover:bg-[#4E2C93] transition-colors duration-300 group-hover:shadow-[0_0_15px_rgba(107,240,255,0.3)] relative z-30">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-center text-white group-hover:text-[#6BF0FF] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-[#D1D5DB] text-center">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
                  <div className="w-6 h-6 border-t-2 border-r-2 border-[#6BF0FF] transform rotate-45 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
