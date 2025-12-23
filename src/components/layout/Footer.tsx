import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import FooterForm from "./FooterForm";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      {/* Newsletter Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 overflow-hidden">
          <div className="md:w-1/2 w-full text-center md:text-left">
            <h4 className="text-2xl font-bold mb-2 text-white">Share Your Enquiry With Us</h4>
            <p className="text-gray-400">Subscribe or send us a message to get the latest updates and quotes.</p>
          </div>
          <div className="md:w-1/2 w-full">
            <FooterForm />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <Link href="/" className="text-2xl font-bold mb-6 block tracking-tight">AxelGuard</Link>
            <div className="flex flex-col gap-4 text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="text-white mt-1 flex-shrink-0" size={20} />
                <p>Office No 210, Second Floor<br/>PC Chamber Sector 66, Noida<br/>Uttar Pradesh - 201301</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-white flex-shrink-0" size={20} />
                <p>+91 87553 11835</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-white flex-shrink-0" size={20} />
                <p>info@axel-guard.com</p>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-12 after:h-1 after:bg-white">Useful Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors flex items-center gap-2">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors flex items-center gap-2">About us</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors flex items-center gap-2">Services</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors flex items-center gap-2">Terms of service</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors flex items-center gap-2">Privacy policy</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-12 after:h-1 after:bg-white">Our Products</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/products?category=mdvr" className="hover:text-white transition-colors flex items-center gap-2">Mobile DVR</Link></li>
              <li><Link href="/products?category=dashcam" className="hover:text-white transition-colors flex items-center gap-2">Dashcams</Link></li>
              <li><Link href="/products?category=gps" className="hover:text-white transition-colors flex items-center gap-2">GPS Tracking</Link></li>
              <li><Link href="/products?category=rfid" className="hover:text-white transition-colors flex items-center gap-2">Active RFID</Link></li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-lg font-bold mb-6 relative inline-block after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-12 after:h-1 after:bg-white">Follow Us</h4>
            <div className="flex gap-4">
              <a href="https://x.com/Axel_guard/with_replies" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="https://www.facebook.com/Realtracktechnology/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/axel_guard_9971/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="https://www.linkedin.com/company/axelguard/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
          <p>© Copyright <strong className="text-white">AxelGuard</strong>. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
