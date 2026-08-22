import React from 'react';
import { Target, Eye, Globe, Compass, Users, Award, Shield } from 'lucide-react';

export default function AboutSection() {
  const teamMembers = [
    {
      name: 'Elena Rostova',
      role: 'Chief Executive Officer',
      bio: 'Ex-Silicon Valley design strategist with 15+ years leading digital transformation for global enterprises.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400'
    },
    {
      name: 'Marcus Vance',
      role: 'Head of Product Engineering',
      bio: 'Full-stack cloud architect specializing in React, Node microservices, and ultra-high-throughput systems.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400'
    },
    {
      name: 'Aria Chen',
      role: 'VP of Digital Growth & SEO',
      bio: 'Growth hacker who has generated over $120M+ in organic and performance search revenues.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400'
    }
  ];

  const coreValues = [
    { icon: Target, title: 'ROI Without Compromise', desc: 'Every line of code and pixel designed must directly tie into business growth goals.' },
    { icon: Globe, title: 'Innovation Without Borders', desc: 'Global talent pool collaborating across time zones to deliver non-stop innovation.' },
    { icon: Shield, title: 'Enterprise-Grade Security', desc: 'Zero-trust architecture, robust encryption, and compliant CPanel deployment standards.' }
  ];

  return (
    <section id="about" className="w-full section-padding relative flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Story Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12 md:mb-16 w-full">
          <div>
            <div className="badge-glow mb-4">About DigiAgency</div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              Engineering Digital <span className="gradient-text-accent">Excellence</span> Since 2018
            </h2>
            <p className="text-slate-300 text-base md:text-lg mb-6 leading-relaxed">
              DigiAgency was founded on a singular premise: traditional agencies charge premium fees for slow iteration cycles. We pioneered the <strong className="text-white">Aetheric Agency Design System</strong>—a high-speed, data-driven framework combining world-class UI/UX with modern React & Express cloud technology.
            </p>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
              We partner directly with CEOs, Founders, and Marketing Directors to build digital assets that outshine competitors and establish market authority.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-indigo-400">100%</span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">In-House Engineering</span>
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-extrabold text-purple-400">24/7</span>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Global SLA Monitoring</span>
              </div>
            </div>
          </div>

          <div className="relative w-full">
            <div className="glass-panel p-2 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden w-full">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000" 
                alt="DigiAgency Team Collaboration" 
                className="w-full h-[420px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-xl border border-white/10">
                <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">Our Mission</p>
                <p className="text-xs text-slate-300">To empower ambitious B2B enterprises with visually captivating, high-performance web products that dominate search engines and maximize client acquisition.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values / Principles That Drive Us (Explicit 70px margin & 50px padding with !important) */}
        <div className="about-core-values-gap border-y border-white/10 w-full flex flex-col items-center">
          <div className="text-center max-w-xl mx-auto mb-14 flex flex-col items-center">
            <div className="badge-glow mb-4 mx-auto">Core Values</div>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white text-center">Principles That Drive Us</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {coreValues.map((val, idx) => (
              <div key={idx} className="glass-card p-8 rounded-2xl flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <val.icon className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">{val.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Profiles / Meet the Architects (Explicit 70px top margin with !important) */}
        <div className="about-leadership-gap w-full flex flex-col items-center">
          <div className="text-center max-w-xl mx-auto mb-14 flex flex-col items-center">
            <div className="badge-glow mb-4 mx-auto">Leadership</div>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white text-center">Meet the Architects</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl text-center group">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border-2 border-indigo-500/40 group-hover:scale-105 transition-transform"
                />
                <h4 className="text-lg font-bold text-white">{member.name}</h4>
                <span className="text-xs font-semibold text-indigo-400 block mb-3">{member.role}</span>
                <p className="text-xs text-slate-400 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
