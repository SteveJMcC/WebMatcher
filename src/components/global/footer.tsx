import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground/80 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary mb-2">
              <Sparkles className="h-6 w-6" />
              WebMatcher
            </Link>
            <p className="text-sm">Connecting you with top web talent and exciting projects.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-secondary-foreground">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/post-job" className="hover:text-primary">Post a Job</Link></li>
              <li><Link href="/designers" className="hover:text-primary">Find A Web Pro</Link></li>
              <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-secondary-foreground">Legal</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm">
          <p>&copy; {new Date().getFullYear()} WebMatcher. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

