
export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-[#1B0642] to-[#2D1066] animate-gradient">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#6BF0FF] relative">
              About Link Management
              <span className="absolute -bottom-2 left-0 w-20 h-1 bg-[#6BF0FF]/50 rounded-full"></span>
            </h2>
            <div className="space-y-4">
              <p className="text-[#D1D5DB] text-lg">
                Link Management is a Publisher Aggregator Platform which
                connects publishers and bloggers with Advertisers (Brands,
                Agencies and Resellers). The Platform is intended to help
                Publishers and Bloggers monetize their blogs/websites and open
                up a stable revenue stream for themselves.
              </p>
              <p className="text-[#D1D5DB] text-lg">
                Our vast experience of working in the Content Marketing and Link
                Building industry has allowed us to connect with numerous
                publishers and advertisers. We wanted to create a positive and
                trustworthy platform, which helps both publishers and
                advertisers mutually benefit from each other.
              </p>
              <div className="pt-6 flex flex-wrap gap-4">
                <a href="#" className="bg-[#1A2233] hover:bg-[#2C3445] text-[#6BF0FF] font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 border border-[#6BF0FF] hover:shadow-[0_0_15px_rgba(107,240,255,0.3)] transform hover:-translate-y-1">
                  About Us
                </a>
                <a href="#contact" className="bg-[#6BF0FF] hover:bg-[#3ED9EB] text-[#0F1724] font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-[0_0_15px_rgba(107,240,255,0.5)] transform hover:-translate-y-1">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 animate-float">
            <div className="relative bg-[#0F1724]/50 p-6 rounded-xl backdrop-blur-sm border border-[#2C3445] hover:border-[#6BF0FF]/30 transition-all duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#1A2233] rounded-lg border border-[#2C3445] group hover:border-[#6BF0FF]/30 transition-all duration-300 text-center">
                  <h3 className="text-3xl font-bold text-[#6BF0FF] mb-2">
                    5000+
                  </h3>
                  <p className="text-[#D1D5DB] group-hover:text-white transition-colors duration-300">
                    Active Publishers
                  </p>
                </div>
                <div className="p-4 bg-[#1A2233] rounded-lg border border-[#2C3445] group hover:border-[#6BF0FF]/30 transition-all duration-300 text-center">
                  <h3 className="text-3xl font-bold text-[#6BF0FF] mb-2">
                    10k+
                  </h3>
                  <p className="text-[#D1D5DB] group-hover:text-white transition-colors duration-300">
                    Monthly Orders
                  </p>
                </div>
                <div className="p-4 bg-[#1A2233] rounded-lg border border-[#2C3445] group hover:border-[#6BF0FF]/30 transition-all duration-300 text-center">
                  <h3 className="text-3xl font-bold text-[#6BF0FF] mb-2">
                    98%
                  </h3>
                  <p className="text-[#D1D5DB] group-hover:text-white transition-colors duration-300">
                    Satisfaction Rate
                  </p>
                </div>
                <div className="p-4 bg-[#1A2233] rounded-lg border border-[#2C3445] group hover:border-[#6BF0FF]/30 transition-all duration-300 text-center">
                  <h3 className="text-3xl font-bold text-[#6BF0FF] mb-2">
                    24h
                  </h3>
                  <p className="text-[#D1D5DB] group-hover:text-white transition-colors duration-300">
                    Support Response
                  </p>
                </div>
              </div>
              <div className="absolute -top-5 -left-5 w-20 h-20 bg-[#4E2C93] rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-[#6BF0FF] rounded-full opacity-20 animate-pulse delay-300"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
