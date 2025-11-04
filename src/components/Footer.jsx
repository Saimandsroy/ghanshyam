import { Facebook, Twitter, Linkedin, Youtube, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0F1724] text-white border-t border-[#2C3445]">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">About Us</h3>
            <p className="text-[#9AA4B2] mb-4">
              Link Management is a Publisher Aggregator Platform connecting
              publishers and bloggers with advertisers to help monetize websites
              and build stable revenue streams.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-[#6BF0FF] rounded-full mr-2 opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"></span>
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-[#6BF0FF] rounded-full mr-2 opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"></span>
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-[#6BF0FF] rounded-full mr-2 opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"></span>
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-[#6BF0FF] rounded-full mr-2 opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"></span>
                  FAQs
                </a>
              </li>
              <li>
                <a href="#contact" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-[#6BF0FF] rounded-full mr-2 opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">
              For Publishers
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-[#6BF0FF] rounded-full mr-2 opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"></span>
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-[#6BF0FF] rounded-full mr-2 opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"></span>
                  Sign Up
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-[#6BF0FF] rounded-full mr-2 opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"></span>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors duration-300 flex items-center">
                  <span className="w-1 h-1 bg-[#6BF0FF] rounded-full mr-2 opacity-0 transform scale-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"></span>
                  Payments
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-[#9AA4B2]">
              <li className="hover:text-[#6BF0FF] transition-colors duration-300">
                Email: info@linkmanagement.net
              </li>
              <li className="hover:text-[#6BF0FF] transition-colors duration-300">
                Support Hours: 24/7
              </li>
              <li className="hover:text-[#6BF0FF] transition-colors duration-300">
                Response Time: 24-48 hours
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#2C3445] mt-12 pt-8 text-center text-[#9AA4B2]">
          <p>
            &copy; {new Date().getFullYear()} Link Management. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
