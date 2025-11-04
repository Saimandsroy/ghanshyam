export function TrustBanner() {
  // Sample logos (replace with actual partner logos)
  const partnerLogos = [
    {
      name: 'Inc42',
      logo: 'https://placehold.co/200x80/1A2233/6BF0FF?text=Inc42'
    },
    {
      name: 'Lifehack',
      logo: 'https://placehold.co/200x80/1A2233/6BF0FF?text=Lifehack'
    },
    {
      name: 'TC',
      logo: 'https://placehold.co/200x80/1A2233/6BF0FF?text=TC'
    },
    {
      name: 'Social Media Examiner',
      logo: 'https://placehold.co/200x80/1A2233/6BF0FF?text=Social+Media+Examiner'
    },
    {
      name: 'Partner 5',
      logo: 'https://placehold.co/200x80/1A2233/6BF0FF?text=Partner+5'
    }
  ];

  return (
    <section className="py-14 bg-[#0F1724] border-y border-[#2C3445]">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-10 tracking-tight">
          <span className="text-white">Join </span>
          <span className="text-[#6BF0FF]">5000+</span>
          <span className="text-white"> Strong Bloggers </span>
          <span className="text-[#6BF0FF]">Club To Enjoy</span>
        </h2>
        <div className="relative overflow-hidden py-6">
          <div className="flex animate-marquee items-center gap-12 md:gap-20">
            {partnerLogos.concat(partnerLogos).map((partner, index) => (
              <div
                key={index}
                className="shrink-0 opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105"
                title={partner.name}
              >
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="h-16 md:h-20 object-contain drop-shadow-[0_4px_12px_rgba(107,240,255,0.35)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
