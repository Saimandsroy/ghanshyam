
export function PlatformPreviewSection() {
  return (
    <section className="py-20 bg-[#0F1724]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-[#6BF0FF]">Powerful Platform</span> For Publishers
          </h2>
          <p className="text-[#D1D5DB] max-w-2xl mx-auto">
            Our intuitive dashboard makes it easy to manage your sponsored content, track earnings, and grow your revenue stream.
          </p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Decorative glows */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#2D1066] rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#6BF0FF] rounded-full opacity-20 blur-3xl" />

          {/* Glassy Mock Dashboard */}
          <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-[#2D1066]/30">
            {/* Window top bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#1A2233]/80 border-b border-white/10">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28CA41]" />
              </div>
              <div className="text-xs text-[#9FB3C8]">links-management.app/dashboard</div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              {/* KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl bg-[#0F1724]/60 border border-white/10 p-4">
                  <div className="text-[#9FB3C8] text-xs">Revenue</div>
                  <div className="text-2xl font-bold text-white">$47,320</div>
                  <div className="text-emerald-400 text-xs">+12.4%</div>
                </div>
                <div className="rounded-xl bg-[#0F1724]/60 border border-white/10 p-4">
                  <div className="text-[#9FB3C8] text-xs">Growth</div>
                  <div className="text-2xl font-bold text-white">+168%</div>
                  <div className="text-emerald-400 text-xs">+4.7% MoM</div>
                </div>
                <div className="rounded-xl bg-[#0F1724]/60 border border-white/10 p-4">
                  <div className="text-[#9FB3C8] text-xs">Avg Payout</div>
                  <div className="text-2xl font-bold text-white">48 hrs</div>
                  <div className="text-[#9FB3C8] text-xs">instant eligible</div>
                </div>
              </div>

              {/* Activity + Chart mock */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-xl bg-[#0F1724]/60 border border-white/10 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-[#9FB3C8]">Last 7 days</div>
                    <div className="text-xs px-2 py-1 rounded bg-white/10 text-white">Analytics</div>
                  </div>
                  {/* simple bar chart mock */}
                  <div className="flex items-end gap-3 h-40">
                    {['h-12','h-24','h-16','h-28','h-36','h-20','h-32'].map((h,i)=> (
                      <div key={i} className={`w-8 rounded bg-gradient-to-t from-[#6BF0FF]/20 to-[#6BF0FF]/60 ${h}`} />
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-[#0F1724]/60 border border-white/10 p-5">
                  <div className="text-sm font-semibold mb-3">Recent Requests</div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center justify-between">
                      <span className="text-[#9FB3C8]">Techify Blog</span>
                      <span className="text-emerald-400">$450</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#9FB3C8]">Daily Wellness</span>
                      <span className="text-emerald-400">$320</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#9FB3C8]">Crypto Journal</span>
                      <span className="text-emerald-400">$610</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-[#9FB3C8]">Travel Nerds</span>
                      <span className="text-emerald-400">$180</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* CTA overlay on hover */}
          <div className="text-center mt-6">
            <a className="inline-block bg-[#6BF0FF] hover:bg-[#3ED9EB] text-[#0F1724] font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(107,240,255,0.5)] transition-all duration-300" href="#get-started">Explore Dashboard</a>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-[#1A2233] p-6 rounded-lg border border-[#2C3445] hover:border-[#6BF0FF]/30 transition-all duration-300 group">
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#6BF0FF] transition-colors duration-300">Easy Management</h3>
            <p className="text-[#D1D5DB]">Intuitive interface to manage all your sponsored content requests in one place.</p>
          </div>
          <div className="bg-[#1A2233] p-6 rounded-lg border border-[#2C3445] hover:border-[#6BF0FF]/30 transition-all duration-300 group">
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#6BF0FF] transition-colors duration-300">Real-time Analytics</h3>
            <p className="text-[#D1D5DB]">Track your earnings and performance with detailed analytics and reports.</p>
          </div>
          <div className="bg-[#1A2233] p-6 rounded-lg border border-[#2C3445] hover:border-[#6BF0FF]/30 transition-all duration-300 group">
            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#6BF0FF] transition-colors duration-300">Fast Payments</h3>
            <p className="text-[#D1D5DB]">Request payments whenever you want with our flexible payout system.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
