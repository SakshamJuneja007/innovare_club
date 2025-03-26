"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const menuItemsLeft = [
  { title: "HOME", href: "/" },
  { title: "EVENTS", href: "/events" },
  { title: "ABOUT", href: "/about" },
  { title: "GALLERY", href: "/gallery" },
];

const menuItemsRight = [
  { title: "STATS", href: "/stats" },
  { title: "PROFILE", href: "/profile" },
  { title: "DASHBOARD", href: "/dashboard" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Get the current route

  return (
    <header className="fixed top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-[#CFFB2D]/20">
      <div className="relative flex h-16 md:h-20 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        
        {/* Left Menu (Desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItemsLeft.map((item) => (
            <Link key={item.title} href={item.href} className="relative text-gray-300 hover:text-[#CFFB2D] transition-colors duration-300 font-medium">
              {item.title}
              {pathname === item.href && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#CFFB2D] to-[#FF3D00] rounded-md"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Center Logo */}
        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 text-3xl font-bold text-[#CFFB2D] hover:text-[#CFFB2D]/80 transition-colors duration-300 font-['Orbitron']">
          INNOVARE
        </Link>

        {/* Right Menu (Desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItemsRight.map((item) => (
            <Link key={item.title} href={item.href} className="relative text-gray-300 hover:text-[#CFFB2D] transition-colors duration-300 font-medium">
              {item.title}
              {pathname === item.href && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#CFFB2D] to-[#FF3D00] rounded-md"
                />
              )}
            </Link>
          ))}

          {/* Login Button (Only on Desktop) */}
          <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        LOGIN
      </span>
    </button>        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-[#CFFB2D] p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-black/95 backdrop-blur-md border border-[#CFFB2D]/20 p-4 w-[90vw] max-w-[400px] z-50 shadow-lg"
            >
              {[...menuItemsLeft, ...menuItemsRight].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`block text-center text-white py-2 hover:text-[#CFFB2D] transition-colors duration-300 relative ${
                    pathname === item.href ? "font-bold" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.title}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-[3px] bg-gradient-to-r from-[#CFFB2D] to-[#FF3D00] rounded-md"
                    />
                  )}
                </Link>
              ))}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
