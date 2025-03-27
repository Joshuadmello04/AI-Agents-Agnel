"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export function HeroCTA() {
  return (
    <div className="relative isolate overflow-hidden bg-[#0a0118] py-24 sm:py-32">
      {/* SVG Background Gradient */}
      <svg
        className="absolute inset-0 -z-10 h-full w-full stroke-purple-500/20 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width={200}
            height={200}
            x="50%"
            y={-1}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-purple-500/10">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
      </svg>

      {/* Animated gradient blob */}
      <div
        className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#4f46e5] to-[#7c3aed] opacity-20"
          style={{
            clipPath:
              'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          >
            Take Control of Your Rankings
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-lg leading-8 text-purple-200"
          >
            Get started with Wope and stay on top of your rankings in no time!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Enter your domain"
                className="block w-full rounded-md border-0 bg-white/5 px-4 py-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
              />
            </div>
            
            <Button className="flex items-center gap-x-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:from-purple-700 hover:to-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500">
              Try Demo <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm leading-6 text-purple-200"
          >
            <div className="flex items-center gap-x-2">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-x-2">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              14-days free trial
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}