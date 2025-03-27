import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm text-white">
      <div className="container px-4 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
          {/* Logo and Description */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-blue-500 rounded-full opacity-70 blur-lg"></div>
                <div className="absolute inset-0.5 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full"></div>
              </div>
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                LogiFlow
              </span>
            </Link>
            <p className="mt-4 text-sm text-foreground/70 max-w-sm text-center md:text-left">
              Intelligent compliance checking and multi-modal route optimization for cross-border logistics.
            </p>
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-blue-600 transition-all">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-blue-600 transition-all">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-blue-600 transition-all">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Button>
            </div>
          </div>

          {/* Links Sections */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              {['Features', 'Pricing', 'API', 'Documentation', 'Release Notes'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              {['About Us', 'Careers', 'Blog', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'GDPR'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-center items-center text-center">
          <p className="text-sm text-foreground/60 mb-4 md:mb-0 md:mr-6">&copy; {currentYear} LogiFlow. All rights reserved.</p>
          <ul className="flex flex-wrap justify-center gap-6 text-sm">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <li key={item}>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}