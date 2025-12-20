"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { submitContactForm } from "./actions";

// Initial state for the form
const initialState = {
  success: false,
  message: "",
};

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-black text-white pt-40 pb-20 rounded-b-[3rem] shadow-2xl">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
             initial="hidden"
             animate="visible"
             variants={fadeIn}
             transition={{ duration: 0.8 }}
             className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
          >
            Get in <span className="text-gray-400">Touch.</span>
          </motion.h1>
          <motion.p 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Reach out for quotes, support, or to discuss how we can secure your fleet.
          </motion.p>
        </div>
      </section>

      <main className="flex-grow py-24 -mt-10 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
            
            {/* Contact Info (Left) */}
            <div className="bg-black text-white p-12 lg:w-2/5 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                <p className="text-gray-400 mb-12 leading-relaxed">
                  Fill up the form and our Team will get back to you within 24 hours.
                </p>
                
                <div className="space-y-8">
                   <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Phone size={18} />
                     </div>
                     <div>
                       <p className="text-sm text-gray-400 mb-1">Phone</p>
                       <p className="font-medium">+91 87553 11835</p>
                     </div>
                   </div>

                   <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Mail size={18} />
                     </div>
                     <div>
                       <p className="text-sm text-gray-400 mb-1">Email</p>
                       <p className="font-medium">info@axel-guard.com</p>
                     </div>
                   </div>

                   <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <MapPin size={18} />
                     </div>
                     <div>
                       <p className="text-sm text-gray-400 mb-1">Address</p>
                       <p className="font-medium leading-relaxed">
                         Office No 210, Second Floor<br/>
                         PC Chamber Sector 66, Noida<br/>
                         Uttar Pradesh - 201301
                       </p>
                     </div>
                   </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                 {/* Socials or extra info could go here */}
                 <p className="text-xs text-gray-500">© 2024 AxelGuard. All rights reserved.</p>
              </div>
            </div>

            {/* Contact Form (Right) */}
            <div className="p-12 lg:w-3/5 bg-white">
              <form action={formAction} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Your Name</label>
                    <input 
                      name="name"
                      type="text" 
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-black transition-colors" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Your Email</label>
                    <input 
                      name="email"
                      type="email" 
                      required
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-black transition-colors" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Mobile Number</label>
                  <input 
                    name="mobile"
                    type="tel" 
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-black transition-colors" 
                    placeholder="9876543210" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Subject</label>
                  <input 
                    name="subject"
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-black transition-colors" 
                    placeholder="Product Enquiry" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">Message</label>
                  <textarea 
                    name="message"
                    required
                    rows={4} 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:border-black transition-colors resize-none" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>Processing <Loader2 className="animate-spin" size={20} /></>
                    ) : (
                      <>Send Message <Send size={20} /></>
                    )}
                  </button>
                </div>

                {state?.message && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-center font-medium ${state.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}
                  >
                    {state.message}
                  </motion.div>
                )}
              </form>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
