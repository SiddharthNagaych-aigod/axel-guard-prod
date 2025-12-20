"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Target, Zap, Award, Search, PenTool, Truck, CheckSquare } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stats = [
  { label: "Years Experience", value: "15+" },
  { label: "Products", value: "50+" },
  { label: "Global Clients", value: "200+" },
  { label: "Countries Served", value: "12" }
];

const timelineSteps = [
  {
    id: 1,
    icon: <Search className="w-6 h-6" />,
    title: "Needs Assessment",
    desc: "Mapping requirements & site study"
  },
  {
    id: 2,
    icon: <PenTool className="w-6 h-6" />,
    title: "Solution Design",
    desc: "Concepts, layouts & customisation"
  },
  {
    id: 3,
    icon: <Zap className="w-6 h-6" />,
    title: "Technology Selection",
    desc: "Choosing the right AI/IoT hardware"
  },
  {
    id: 4,
    icon: <CheckSquare className="w-6 h-6" />,
    title: "Quality Control",
    desc: "Rigorous testing & validation"
  },
  {
    id: 5,
    icon: <Truck className="w-6 h-6" />,
    title: "Deployment",
    desc: "Final installation & handover"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
             <Image 
               src="/assets/img/about.jpg" 
               alt="AxelGuard Team" 
               fill
               className="object-cover opacity-50 grayscale"
               priority
               unoptimized
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            >
              Safeguarding Your <span className="text-gray-400">Journey.</span>
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto"
            >
              Leaders in vehicle safety systems, committed to protecting lives and optimizing fleet operations globally.
            </motion.p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24 bg-black text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                <div className="h-1 w-20 bg-white mb-8" />
                <p className="text-xl text-gray-300 leading-relaxed mb-6">
                  At AxelGuard, we are driven by a singular purpose: to make roads safer for everyone. We believe that advanced technology is the key to preventing accidents and saving lives.
                </p>
                <p className="text-lg text-gray-400 leading-relaxed">
                  From Mobile DVRs to AI-powered Dashcams, our solutions are designed to provide real-time visibility and actionable insights. We partner with businesses to transform their fleet management, ensuring compliance, efficiency, and above all, safety.
                </p>
              </motion.div>
              <div className="relative h-[400px] border border-white/20 rounded-2xl overflow-hidden flex items-center justify-center bg-white/5">
                 <Shield className="w-32 h-32 text-white/20" />
              </div>
            </div>
          </div>
        </section>

        {/* Timeline / Why Choose Us Section */}
        <section className="py-32 bg-white overflow-hidden">
          <div className="container mx-auto px-4 text-center mb-20">
             <h2 className="text-4xl font-bold mb-4">How We Work</h2>
             <p className="text-gray-500">A seamless process from concept to execution.</p>
          </div>

          <div className="container mx-auto px-4 relative">
             
             {/* The Rope (Line) */}
             <div className="absolute top-[40px] left-0 w-full hidden md:block z-0 px-10">
                <svg className="w-full h-[20px]" preserveAspectRatio="none">
                  <motion.path
                    d="M 0 10 L 2000 10"
                    fill="transparent"
                    stroke="black"
                    strokeWidth="2"
                    strokeDasharray="10 10"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                </svg>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {timelineSteps.map((step, index) => (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="flex flex-col items-center text-center group"
                  >
                     {/* Step Icon Circle */}
                     <div className="w-20 h-20 bg-white border-2 border-dashed border-black rounded-full flex items-center justify-center mb-6 relative z-10 group-hover:bg-black group-hover:text-white transition-all duration-300 shadow-lg">
                        <div className="absolute -top-3 -left-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                          {step.id}
                        </div>
                        {step.icon}
                     </div>
                     
                     <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                     <p className="text-sm text-gray-500 max-w-[150px]">{step.desc}</p>
                  </motion.div>
                ))}
             </div>

          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-black text-white border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-white text-black text-center">
          <div className="container mx-auto px-4">
             <h2 className="text-4xl font-bold mb-6">Ready to secure your fleet?</h2>
             <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Join the hundreds of companies that trust AxelGuard for their vehicle safety solutions.</p>
             <Link 
               href="/contact" 
               className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-colors shadow-2xl"
             >
               Get in Touch
             </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
