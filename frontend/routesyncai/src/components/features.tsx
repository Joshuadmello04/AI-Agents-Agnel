"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function Features() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section id="features" className="py-20 relative" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-700 bg-[#0a0118]/30 backdrop-blur-sm">
            <span className="text-sm font-medium text-purple-200">SPREADSHEET-LIKE EXPERIENCE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white glow-text">Master Your Data:</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white glow-text">Ultimate Table Experience</h3>
          <p className="text-lg text-purple-200/80 max-w-3xl mx-auto">
            Feel free to customize your reports. Utilize our super-table instead of exporting and importing data for
            over and over.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Visual Performance Indicators",
              description:
                "LogiFlow provides you with visual performance indicators so that you can see how well you're doing at a glance.",
              icon: (
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
                  className="text-purple-400"
                >
                  <path d="M2 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H2v-8Z"></path>
                  <path d="M6 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6V8Z"></path>
                  <path d="M10 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2V4Z"></path>
                  <path d="M14 2h2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2V2Z"></path>
                  <path d="M18 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2V6Z"></path>
                </svg>
              ),
            },
            {
              title: "Instant Filter & Sort",
              description:
                "Quickly filter and sort your data to find exactly what you need without exporting to spreadsheets.",
              icon: (
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
                  className="text-purple-400"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              ),
            },
            {
              title: "Summarize & Find Patterns",
              description:
                "Our AI automatically summarizes your data and identifies patterns to help you make better decisions.",
              icon: (
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
                  className="text-purple-400"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <line x1="10" y1="9" x2="8" y2="9"></line>
                </svg>
              ),
            },
            {
              title: "Organize & Categorize",
              description:
                "Easily organize your shipments and routes into categories for better management and analysis.",
              icon: (
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
                  className="text-purple-400"
                >
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              ),
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group spotlight-container"
            >
              <div className="spotlight"></div>
              <div className="relative p-6 bg-[#0a0118]/50 backdrop-blur-sm border border-purple-700/40 rounded-xl h-full transform transition-transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <div className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-[#120826]/50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-100">{feature.title}</h3>
                <p className="text-purple-200/70">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{ y, opacity }}
          className="mt-16 relative rounded-xl overflow-hidden border border-purple-700/40 shadow-2xl glow-border"
        >
          <div className="h-10 bg-[#0a0118]/90 border-b border-purple-700/40 flex items-center px-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 text-center text-xs text-purple-100/60">Data Explorer</div>
          </div>
          <div className="bg-[#0a0118]/30 backdrop-blur-sm p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-purple-700/40">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Keyword
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Visibility
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Traffic
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Opportunity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                      Traffic Share
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-800/40">
                  <tr className="hover:bg-purple-800/20">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">playstation 5</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">3.4M</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">11</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">+4</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">52%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">123.4K</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">12.3%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">12.3%</td>
                  </tr>
                  <tr className="hover:bg-purple-800/20">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">kindle</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">450K</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">8</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">+4</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">62%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">123.4K</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">12.3%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-purple-100">12.3%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

