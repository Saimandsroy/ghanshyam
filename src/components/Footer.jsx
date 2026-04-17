import { Facebook, Twitter, Linkedin, Youtube, Instagram, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-white text-slate-800 border-t border-slate-200 pt-20 overflow-hidden font-sans">

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Glow Effect */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#F97316]/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24 mb-16">

          {/* Column 1: About Us */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">About Us</h3>
              <div className="h-1 w-12 bg-[#F97316] rounded-full"></div>
            </div>

            <p className="text-slate-600 leading-relaxed text-[15px] font-medium max-w-md">
              Link Management is a Publisher Aggregator Platform which connects publishers and bloggers with Advertisers (Brands, Agencies and Resellers). The Platform is intended to help Publishers and Bloggers monetize their blogs/websites and open up a stable revenue stream for themselves.
            </p>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Useful Links</h3>
              <div className="h-1 w-12 bg-[#F97316] rounded-full"></div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "#about" },
                { name: "Careers", href: "#" },
                { name: "FAQs", href: "#" },
                { name: "Videos", href: "#" },
                { name: "Contact", href: "#" },
                { name: "Privacy Policy", href: "#" },
                { name: "Login", href: "/login" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-2 text-slate-500 font-medium hover:text-[#F97316] transition-all duration-300 text-[15px]"
                  >
                    <span className="w-1.5 h-1.5 bg-[#F97316] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Follow Us</h3>
              <div className="h-1 w-12 bg-[#F97316] rounded-full"></div>
            </div>

            <div className="space-y-4">
              {[
                { name: "Twitter", icon: Twitter },
                { name: "Facebook", icon: Facebook },
                { name: "LinkedIn", icon: Linkedin },
                { name: "YouTube", icon: Youtube },
                { name: "Instagram", icon: Instagram },
              ].map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="flex items-center gap-4 text-slate-500 font-medium hover:text-[#F97316] transition-colors duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:border-[#F97316]/30 group-hover:bg-[#F97316]/5 transition-all shadow-sm">
                    <social.icon className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <span className="text-[15px] font-semibold">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-200 pt-8 pb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 font-medium text-sm">
            Copyright &copy; {new Date().getFullYear()} Esoftec. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 font-medium hover:text-[#F97316] text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 font-medium hover:text-[#F97316] text-sm transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* Femur Studio Premium Branding */}
      <div className="bg-gradient-to-b from-white to-slate-50 w-full py-16 flex justify-center items-center z-20 border-t border-slate-100 relative overflow-hidden">
        {/* Subtle decorative glow for premium feel */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F97316]/[0.04] blur-[80px] rounded-full pointer-events-none"></div>
        
        <a 
          href="https://femur.studio" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center group cursor-pointer transition-all duration-700 hover:-translate-y-1 no-underline relative z-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-slate-200 group-hover:bg-[#F97316]/40 transition-colors duration-500"></div>
            <span className="text-[10px] sm:text-[11px] tracking-[0.4em] text-slate-400 font-bold uppercase transition-colors duration-500 group-hover:text-[#F97316]">
              Designed & Developed by
            </span>
            <div className="w-8 h-[1px] bg-slate-200 group-hover:bg-[#F97316]/40 transition-colors duration-500"></div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-black tracking-[0.2em] bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent group-hover:from-[#F97316] group-hover:to-[#fb923c] transition-all duration-700 uppercase mb-7 drop-shadow-sm pb-1">
            Femur Studio
          </h2>
          
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 group-hover:border-[#F97316]/30 transition-all duration-500 relative overflow-hidden mb-7 group-hover:shadow-[0_8px_40px_rgba(249,115,22,0.15)] bg-clip-padding">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent"></div>
            <span className="relative text-slate-800 font-serif text-4xl sm:text-5xl font-normal tracking-tight flex items-center justify-center leading-none mt-1 group-hover:text-[#F97316] transition-colors duration-500" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              F<span className="relative -ml-1.5 sm:-ml-2">S</span>
            </span>
          </div>

          <span className="text-[9px] sm:text-[10px] tracking-[0.4em] text-slate-400 group-hover:text-[#F97316]/80 transition-colors duration-500 uppercase font-bold">
            Architecting Digital Excellence
          </span>
        </a>
      </div>
    </footer>
  );
}
