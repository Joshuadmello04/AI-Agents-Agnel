"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

export function Cta() {
  return (
    <section id="contact" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border/40 bg-background/50 backdrop-blur-sm overflow-hidden"
        >
          <div className="p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Cross-Border Logistics?</h2>
              <p className="text-lg text-foreground/80">
                Join thousands of businesses that have simplified their international shipping operations with LogiFlow.
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 bg-background/50 backdrop-blur-sm border-border/50"
                />
                <Button className="h-12">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-center text-foreground/60">
                Start your 14-day free trial. No credit card required.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

