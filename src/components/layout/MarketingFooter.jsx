import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Icons } from "@/config/icons";

export function MarketingFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tighter text-lg">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs">
                {siteConfig.logoText[0]}
              </div>
              {siteConfig.name}
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {siteConfig.description} Build production-ready websites simply and beautifully.
            </p>
            <div className="flex space-x-4">
              {/* Dummy social links */}
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Icons.mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Support</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Changelog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-border pt-8 flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-4 sm:mt-0 text-sm text-muted-foreground">
            Made with <span className="text-primary font-medium mx-1">Lucid SaaS Generator</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
