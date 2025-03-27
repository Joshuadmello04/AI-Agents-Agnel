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
    <section id="pricing" className="text-white py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-border bg-background/30 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-foreground/80">Pricing Plans</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Choose the Right Plan for Your Business
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-foreground/80"
          >
            All plans include a 14-day free trial with no credit card required. Cancel anytime.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={cn(
                "w-full max-w-sm relative rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm overflow-hidden",
                plan.popular && "border-blue-500/50 shadow-lg shadow-blue-500/10",
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Most Popular
                </div>
              )}
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-foreground/70 ml-2">/month</span>}
                </div>
                <p className="text-foreground/70 mb-6 flex-grow">{plan.description}</p>
                <Button className={cn("w-full mb-6", plan.popular ? "bg-blue-500 hover:bg-blue-600" : "")}>
                  {plan.cta}
                </Button>
                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}