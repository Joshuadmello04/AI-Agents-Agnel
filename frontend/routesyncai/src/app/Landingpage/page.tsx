import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { ComplianceChecker } from "@/components/compliance-checker"
import { RouteSelector } from "@/components/route-selector"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"
import { GlobeSection } from "@/components/globe-section"
import { Globe } from "@/components/ui/globe"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[#0a0118]"></div>
      <Navbar />
      <Hero />
      <GlobeSection />
      <Globe/>
      <Features />
      <ComplianceChecker />
      <RouteSelector />
      <Pricing />
      <div
        dangerouslySetInnerHTML={{
          __html: `<elevenlabs-convai agent-id="mvNNb9R3OywTXCOoX1mX"></elevenlabs-convai><script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>`,
        }}
      ></div>
      <Footer />
    </main>
  )
}

