"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "LogiFlow has transformed our cross-border shipping operations. We've reduced compliance issues by 87% and optimized our routes to save over $250,000 annually.",
      author: "Sarah Johnson",
      title: "Logistics Director, Global Exports Inc.",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "The multi-modal route selector is a game-changer. We can now make data-driven decisions about shipping methods in seconds instead of hours of manual calculations.",
      author: "Michael Chen",
      title: "Supply Chain Manager, Tech Innovations Ltd.",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      quote:
        "As a small business shipping internationally, compliance was our biggest headache. LogiFlow's automated checks have eliminated customs delays and saved us from costly penalties.",
      author: "Emma Rodriguez",
      title: "CEO, Artisan Exports Co.",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container max-w-5xl">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-border bg-background/30 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-foreground/80">Success Stories</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold"
          >
            Trusted by Logistics Professionals
          </motion.h2>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm p-8 md:p-12">
            <div className="absolute top-6 left-6 text-blue-500/20">
              <Quote size={120} />
            </div>

            <div className="relative z-10">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{
                    opacity: activeIndex === index ? 1 : 0,
                    x: activeIndex === index ? 0 : 100,
                    position: activeIndex === index ? "relative" : "absolute",
                  }}
                  transition={{ duration: 0.5 }}
                  className={cn("text-center", activeIndex !== index && "pointer-events-none")}
                >
                  <p className="text-xl md:text-2xl italic mb-8 text-foreground/90">"{testimonial.quote}"</p>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-blue-500/50">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-foreground/70">{testimonial.title}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-4">
            <Button variant="outline" size="icon" onClick={prevTestimonial} className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-colors",
                    activeIndex === index ? "bg-blue-500" : "bg-foreground/20",
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={nextTestimonial} className="rounded-full">
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

