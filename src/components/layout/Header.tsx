"use client";

import { useState } from "react";
import Link from "next/link";

import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  // Navigation Links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];

  const productCategories = [
    { 
      name: "Mobile DVR (MDVR)", 
      href: "/products?category=mdvr",
      subcategories: [
        { name: "Basic version MDVR", href: "/products?category=mdvr-basic" },
        { name: "Enhanced Version MDVR", href: "/products?category=mdvr-enhanced" },
        { name: "AI Version MDVR", href: "/products?category=mdvr-ai" },
      ]
    },
    { name: "Dashcam", href: "/products?category=dashcam" },
    { name: "Camera", href: "/products?category=camera" },
    { name: "RFID", href: "/products?category=rfid" },
    { name: "Accessories", href: "/products?category=accessories" },
  ];

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300 bg-black/95 backdrop-blur-md shadow-sm border-b border-white/10">
      {/* Top Bar */}
      <div className="bg-black text-white/80 text-xs py-2 px-4 hidden md:flex justify-between items-center border-b border-white/10">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><Mail size={12} /> info@axel-guard.com</span>
          <span className="flex items-center gap-1"><Phone size={12} /> +91 87553 11835</span>
        </div>
        <div className="flex gap-4">
          <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-1 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
           {/* Using standard img tag for absolute stability and visibility */}
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img 
             src="https://res.cloudinary.com/dyn049kt9/image/upload/v1766354509/axelguard/logo/axellogo.webp" 
             alt="AxelGuard Logo" 
             className="h-10 w-auto object-contain"
           />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-[family-name:var(--font-nav)]">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-white hover:text-gray-300 font-bold transition-colors"
            >
              {link.name}
            </Link>
          ))}

          {/* Products Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsProductDropdownOpen(true)}
            onMouseLeave={() => setIsProductDropdownOpen(false)}
          >
            <button className="flex items-center gap-1 text-white hover:text-gray-300 font-bold transition-colors">
              Products <ChevronDown size={16} />
            </button>
            
            <div className={`absolute top-full left-0 w-64 bg-black border border-white/20 shadow-xl rounded-md transition-all duration-200 ${isProductDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              <div className="py-2">
                {productCategories.map((category) => (
                  <div key={category.name} className="relative group/sub">
                    <Link
                      href={category.href}
                      className="flex items-center justify-between px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {category.name}
                      {category.subcategories && <ChevronDown size={14} className="-rotate-90" />}
                    </Link>
                    
                    {/* Nested Dropdown */}
                    {category.subcategories && (
                      <div className="absolute left-full top-0 w-64 bg-black border border-white/20 shadow-xl rounded-md overflow-hidden opacity-0 invisible translate-x-2 group-hover/sub:opacity-100 group-hover/sub:visible group-hover/sub:translate-x-0 transition-all duration-200">
                        <div className="py-2">
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Link href="/services" className="text-white hover:text-gray-300 font-bold transition-colors">Services</Link>
          <Link href="/blog" className="text-white hover:text-gray-300 font-bold transition-colors">Blog</Link>
          


          <Link 
            href="/contact" 
            className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transform hover:-translate-y-0.5 duration-200"
          >
            Get Quote
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black text-white shadow-lg border-t border-white/10 py-6 px-6 flex flex-col gap-6 h-screen overflow-y-auto pb-24">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-xl font-bold text-white hover:text-gray-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="border-t border-white/10 py-4">
            <div className="font-bold text-gray-500 mb-4 uppercase tracking-widest text-sm">Products</div>
            {productCategories.map((category) => (
              <div key={category.name}>
                <Link
                  href={category.href}
                  className="block py-3 text-base text-gray-300 pl-4 hover:text-white border-l-2 border-transparent hover:border-white transition-all"
                  onClick={() => !category.subcategories && setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
                {/* Mobile Subcategories */}
                {category.subcategories && (
                  <div className="ml-8 border-l border-white/10 pl-4 mt-1 space-y-2">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block py-2 text-sm text-gray-400 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                       {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link href="/services" className="text-xl font-bold text-white hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
          <Link href="/blog" className="text-xl font-bold text-white hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
          <Link href="/contact" className="text-xl font-bold text-white hover:text-gray-300" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          

        </div>
      )}
    </header>
  );
}
