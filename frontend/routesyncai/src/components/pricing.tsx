"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      description: "Perfect for small businesses just starting with international shipping",
      features: [
        "Compliance checking for up to 100 shipments/month",
        "Basic route optimization",
        "Email support",
        "CSV import/export",
        "Standard compliance reports",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional",
      price: "$249",
      description: "Ideal for growing businesses with regular international shipments",
      features: [
        "Compliance checking for up to 500 shipments/month",
        "Advanced multi-modal route optimization",
        "Priority email & chat support",
        "API access",
        "Custom compliance rules",
        "Carbon footprint calculation",
        "Real-time tracking integration",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large-scale logistics operations",
      features: [
        "Unlimited compliance checking",
        "Premium multi-modal route optimization",
        "Dedicated account manager",
        "Full API access",
        "Custom integrations",
        "Advanced analytics dashboard",
        "Bulk processing",
        "SLA guarantees",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="py-20 relative overflow-hidden bg-[#0a0118]">
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 opacity-20 bg-[size:40px_40px] bg-[linear-gradient(to_right,#4f46e50f_1px,transparent_1px),linear-gradient(to_bottom,#4f46e50f_1px,transparent_1px)]"></div>

      {/* Gradient background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-300"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, type: "spring" }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-purple-300">PRICING PLANS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
          >
            Choose the Right Plan for Your Business
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="text-lg text-purple-100/80"
          >
            All plans include a 14-day free trial with no credit card required. Cancel anytime.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ 
                duration: 0.6, 
                delay: 0.1 * index,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className={cn(
                "w-full max-w-sm relative rounded-lg border border-purple-500/20 bg-gradient-to-b from-[#1a0933]/80 to-[#0d0520]/90 backdrop-blur-sm overflow-hidden",
                "transition-all duration-200 ease-in-out",
                "hover:shadow-lg hover:shadow-purple-500/20",
                plan.popular && "border-blue-400/50 shadow-lg shadow-blue-500/20",
              )}
            >
              {/* Glowing ring for popular plan */}
              {plan.popular && (
                <>
                  <div className="absolute -inset-1 rounded-lg bg-blue-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-xs font-medium px-3 py-1 rounded-bl-lg shadow-md">
                    Most Popular
                  </div>
                </>
              )}

              {/* Pricing card content */}
              <div className="p-6 flex flex-col h-full relative z-10">
                <h3 className="text-xl font-semibold mb-2 text-white">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && <span className="text-purple-200/70 ml-2">/month</span>}
                </div>
                <p className="text-purple-200/80 mb-6 flex-grow">{plan.description}</p>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mb-6"
                >
                  <Button 
                    className={cn(
                      "w-full relative overflow-hidden font-medium",
                      plan.popular 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white" 
                        : "bg-[#1a0933] hover:bg-[#241044] border border-purple-500/30 hover:border-blue-400/50 text-purple-100"
                    )}
                  >
                    <span className="relative z-10">{plan.cta}</span>
                    {plan.popular && (
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 hover:opacity-100 transition-opacity"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      />
                    )}
                  </Button>
                </motion.div>

                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="flex items-start group"
                    >
                      <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3 shrink-0 group-hover:text-purple-400 transition-colors" />
                      <span className="text-sm text-purple-100/90 group-hover:text-white transition-colors">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Subtle hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}