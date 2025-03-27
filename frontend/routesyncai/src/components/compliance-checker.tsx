"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function ComplianceChecker() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section id="solutions" ref={sectionRef} className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-700 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-700 to-transparent"></div>
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4 px-4 py-1.5 rounded-full border border-blue-700 bg-blue-900/30 backdrop-blur-sm"
            >
              <span className="text-sm font-medium text-blue-200">Solution #1</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-white"
            >
              Rapid Compliance Checker for Cross-Border Shipments
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-blue-200/80 mb-6"
            >
              Verify the compliance of each parcel before it's handed off to the courier. Our system checks for missing
              required fields, restricted item types, and conflicting destination restrictions in real-time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-4 mb-8"
            >
              {[
                "Upload shipment data via CSV or input manually",
                "Define custom compliance rules for your business",
                "Get clear alerts with actionable solutions",
                "Generate compliance reports automatically",
              ].map((feature, index) => (
                <div key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-blue-400 mt-0.5 mr-3 shrink-0"
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
                  <span className="text-blue-100">{feature}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-md transition-colors">
                Learn More
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
            </motion.div>
          </div>

          <motion.div style={{ y, opacity }} className="relative">
            <div className="relative bg-blue-900/50 backdrop-blur-sm border border-blue-700/40 rounded-xl overflow-hidden shadow-xl transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
              <div className="h-10 bg-blue-900/90 border-b border-blue-700/40 flex items-center px-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex-1 text-center text-xs text-blue-100/60">Compliance Checker</div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-blue-400 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <path d="M16 13H8"></path>
                      <path d="M16 17H8"></path>
                      <path d="M10 9H8"></path>
                    </svg>
                    <h3 className="font-medium text-blue-100">Shipment Compliance Dashboard</h3>
                  </div>
                  <div className="text-sm text-blue-200/60">Today, 10:45 AM</div>
                </div>

                <div className="space-y-4">
                  {[
                    { id: "SH-1234", status: "Compliant", icon: "check-circle", color: "green" },
                    { id: "SH-1235", status: "Missing Documentation", icon: "alert-triangle", color: "yellow" },
                    { id: "SH-1236", status: "Restricted Item", icon: "x-circle", color: "red" },
                    { id: "SH-1237", status: "Compliant", icon: "check-circle", color: "green" },
                    { id: "SH-1238", status: "Value Exceeds Limit", icon: "info", color: "blue" },
                  ].map((shipment) => (
                    <div
                      key={shipment.id}
                      className={`p-4 rounded-lg border border-${shipment.color}-500/30 bg-${shipment.color}-500/10 flex items-center justify-between`}
                    >
                      <div className="flex items-center">
                        <svg
                          className={`h-5 w-5 text-${shipment.color}-400 mr-3`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {shipment.icon === "check-circle" && <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>}
                          {shipment.icon === "check-circle" && <polyline points="22 4 12 14.01 9 11.01"></polyline>}
                          {shipment.icon === "alert-triangle" && (
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                          )}
                          {shipment.icon === "alert-triangle" && <line x1="12" y1="9" x2="12" y2="13"></line>}
                          {shipment.icon === "alert-triangle" && <line x1="12" y1="17" x2="12.01" y2="17"></line>}
                          {shipment.icon === "x-circle" && <circle cx="12" cy="12" r="10"></circle>}
                          {shipment.icon === "x-circle" && <line x1="15" y1="9" x2="9" y2="15"></line>}
                          {shipment.icon === "x-circle" && <line x1="9" y1="9" x2="15" y2="15"></line>}
                          {shipment.icon === "info" && <circle cx="12" cy="12" r="10"></circle>}
                          {shipment.icon === "info" && <line x1="12" y1="16" x2="12" y2="12"></line>}
                          {shipment.icon === "info" && <line x1="12" y1="8" x2="12.01" y2="8"></line>}
                        </svg>
                        <div>
                          <div className="font-medium text-blue-100">{shipment.id}</div>
                          <div className={`text-sm text-${shipment.color}-400`}>{shipment.status}</div>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm bg-blue-800/50 hover:bg-blue-700/50 text-blue-100 rounded-md transition-colors">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
                  <div className="flex items-center mb-2">
                    <svg
                      className="h-5 w-5 text-blue-400 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <h4 className="font-medium text-blue-100">Compliance Summary</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">3</div>
                      <div className="text-sm text-blue-200/70">Compliant</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">1</div>
                      <div className="text-sm text-blue-200/70">Warnings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">1</div>
                      <div className="text-sm text-blue-200/70">Violations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

