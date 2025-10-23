import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, User } from 'lucide-react';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted:', formData);
    alert('Thanks for your message! Our team will get back to you within 24-48 hours.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-[#0F1724] to-[#1B0642] animate-gradient">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Get In Touch <span className="text-[#6BF0FF]">With Us</span>
        </h2>
        <div className="max-w-4xl mx-auto bg-[#1A2233] rounded-xl shadow-xl shadow-[#2D1066]/30 overflow-hidden border border-[#2C3445]">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-[#2D1066] to-[#4E2C93] p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Contact Info</h3>
              <div className="space-y-6">
                <div className="flex items-center group">
                  <Mail className="w-6 h-6 mr-4 text-[#6BF0FF] group-hover:animate-pulse" />
                  <span className="group-hover:text-[#6BF0FF] transition-colors duration-300">
                    info@linkmanagement.net
                  </span>
                </div>
                <div className="flex items-center group">
                  <Phone className="w-6 h-6 mr-4 text-[#6BF0FF] group-hover:animate-pulse" />
                  <span className="group-hover:text-[#6BF0FF] transition-colors duration-300">
                    +1 (888) 123-4567
                  </span>
                </div>
                <div className="flex items-start group">
                  <MessageSquare className="w-6 h-6 mr-4 mt-1 text-[#6BF0FF] group-hover:animate-pulse" />
                  <span className="group-hover:text-[#6BF0FF] transition-colors duration-300">
                    Our team will respond to your inquiry within 24-48 hours
                  </span>
                </div>
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2" htmlFor="name">
                      Your Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-[#9AA4B2]" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-3 py-3 bg-[#0F1724] border border-[#2C3445] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BF0FF] focus:border-transparent text-white placeholder-[#9AA4B2] transition-all duration-300"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-[#9AA4B2]" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-3 py-3 bg-[#0F1724] border border-[#2C3445] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BF0FF] focus:border-transparent text-white placeholder-[#9AA4B2] transition-all duration-300"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-[#9AA4B2]" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 bg-[#0F1724] border border-[#2C3445] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BF0FF] focus:border-transparent text-white placeholder-[#9AA4B2] transition-all duration-300"
                        placeholder="+1 (123) 456-7890"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2" htmlFor="subject">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 bg-[#0F1724] border border-[#2C3445] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BF0FF] focus:border-transparent text-white placeholder-[#9AA4B2] transition-all duration-300"
                      placeholder="How can we help you?"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#D1D5DB] mb-2" htmlFor="message">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="block w-full px-4 py-3 bg-[#0F1724] border border-[#2C3445] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BF0FF] focus:border-transparent text-white placeholder-[#9AA4B2] transition-all duration-300"
                    placeholder="Tell us how we can assist you..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto bg-[#6BF0FF] hover:bg-[#3ED9EB] text-[#0F1724] font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(107,240,255,0.5)] animate-pulse-glow"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
