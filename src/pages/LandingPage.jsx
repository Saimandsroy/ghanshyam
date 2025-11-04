import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { TrustBanner } from '../components/TrustBanner';
import { FeaturesSection } from '../components/FeaturesSection';
import { AboutSection } from '../components/AboutSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { ContactSection } from '../components/ContactSection';
import { PlatformPreviewSection } from '../components/PlatformPreviewSection';
import { Footer } from '../components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#0F1724]">
      <Navbar />
      <main>
        <HeroSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="how-it-works">
          <HowItWorksSection />
        </section>
        <TestimonialsSection />
        <section id="contact">
          <ContactSection />
        </section>
        <PlatformPreviewSection />
        <TrustBanner />
      </main>
      <Footer />
    </div>
  );
}
