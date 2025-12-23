"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  const phoneNumber = "918755311835"; // From Footer
  const message = "Hi, I'm interested in AxelGuard products.";
  const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={32} fill="white" className="text-white" />
      <span className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
        Chat with us
      </span>
    </a>
  );
}
