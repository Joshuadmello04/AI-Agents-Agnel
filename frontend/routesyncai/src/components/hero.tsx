"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [spotlightPosition, setSpotlightPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        setMousePosition({ x, y })

        // Update spotlight position with some delay for smooth effect
        setTimeout(() => {
          setSpotlightPosition({ x, y })
        }, 100)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background: `radial-gradient(circle at ${spotlightPosition.x}% ${spotlightPosition.y}%, rgba(149, 76, 233, 0.15), transparent 30%)`,
          transition: "background 0.3s ease",
        }}
      ></div>

      {/* Grid background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-700 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-purple-700 bg-[#0a0118]/30 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-purple-200">Revolutionizing Cross-Border Logistics</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 glow-text"
          >
            Intelligent Compliance & Route Optimization
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-purple-100/80 mb-8 max-w-2xl mx-auto"
          >
            Streamline your cross-border shipments with AI-powered compliance checking and multi-modal route
            optimization. Save time, reduce costs, and eliminate errors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <div className="relative flex-1 max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 pr-32 bg-[#0a0118]/50 backdrop-blur-sm border border-purple-700/50 rounded-md px-4 text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button className="absolute right-1 top-1 h-10 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors">
                Get Started
                <svg
                  className="inline-block ml-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-purple-200/70"
          >
            <div className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-purple-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-purple-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-purple-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative mt-16 rounded-xl overflow-hidden border border-purple-700/40 shadow-2xl glow-border"
          style={{
            transform: `perspective(1000px) rotateX(${(mousePosition.y - 50) * -0.05}deg) rotateY(${(mousePosition.x - 50) * 0.05}deg)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/20 via-transparent to-purple-500/20"></div>
          <div className="h-8 bg-[#0a0118]/90 border-b border-purple-700/40 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 text-center text-xs text-purple-100/60">LogiFlow Dashboard</div>
          </div>
          <div className="bg-[#0a0118]/30 backdrop-blur-sm p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#0a0118]/50 rounded-lg border border-purple-700/40 p-4 transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <div className="text-sm font-medium mb-2 text-purple-300">Compliance Status</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-purple-100">94%</div>
                  <div className="text-green-400 text-sm">+2.5%</div>
                </div>
                <div className="mt-4 h-24 bg-gradient-to-r from-purple-600/20 to-purple-400/20 rounded-md flex items-end">
                  {[40, 65, 55, 70, 85, 75, 90].map((h, i) => (
                    <div key={i} className="flex-1 mx-0.5" style={{ height: `${h}%` }}>
                      <div className="h-full w-full bg-purple-400/70 rounded-sm"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0a0118]/50 rounded-lg border border-purple-700/40 p-4 transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <div className="text-sm font-medium mb-2 text-purple-300">Route Efficiency</div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-purple-100">87%</div>
                  <div className="text-green-400 text-sm">+4.3%</div>
                </div>
                <div className="mt-4 h-24 relative">
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(40%_36%_at_50%_50%,#9333ea_0%,transparent_100%)] opacity-20"></div>
                  </div>
                  <div className="relative h-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-purple-400/30 flex items-center justify-center">
                      <div className="text-lg font-bold text-purple-300">87%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0118]/50 rounded-lg border border-purple-700/40 p-4 transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <div className="text-sm font-medium mb-2 text-purple-300">Shipment Status</div>
                <div className="space-y-3 mt-3">
                  {[
                    { id: "SH-1234", status: "Delivered", color: "green" },
                    { id: "SH-1235", status: "In Transit", color: "yellow" },
                    { id: "SH-1236", status: "Processing", color: "purple" },
                    { id: "SH-1237", status: "Compliance Check", color: "orange" },
                  ].map((shipment) => (
                    <div key={shipment.id} className="flex items-center justify-between">
                      <div className="text-sm text-purple-100">{shipment.id}</div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full bg-${shipment.color}-500/20 text-${shipment.color}-400`}
                      >
                        {shipment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

