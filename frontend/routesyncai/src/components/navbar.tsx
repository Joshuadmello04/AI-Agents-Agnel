"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Solutions", href: "#solutions" },
    { name: "Pricing", href: "#pricing" },
    { name: "Resources", href: "#resources" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0a0118]/80 backdrop-blur-md border-b border-purple-900/40 py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-purple-500 rounded-full opacity-70 blur-sm"></div>
            <div className="absolute inset-0.5 bg-gradient-to-tr from-purple-600 to-purple-400 rounded-full"></div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-100 glow-text">
            LogiFlow
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-purple-100/80 hover:text-purple-100 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button className="px-4 py-2 text-sm text-purple-100/90 hover:text-purple-100 transition-colors">
            Log in
          </button>
          <button className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors">
            Get Started
          </button>
        </div>

        <button className="md:hidden text-purple-100" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-[#0a0118]/95 backdrop-blur-md border-b border-purple-900/40"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-purple-100/80 hover:text-purple-100 py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <button className="w-full py-2 text-left text-purple-100/90 hover:text-purple-100 transition-colors">
                Log in
              </button>
              <button className="w-full py-2 text-left bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

