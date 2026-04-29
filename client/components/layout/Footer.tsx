import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="mb-4">
            <div className="font-heading font-bold text-2xl tracking-tight">TRIKRITI</div>
            <div className="text-brand-red text-xs tracking-[0.25em] uppercase font-body">Studio</div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed font-body mb-5">
            Where Ideas Get Printed. Premium quality custom printing services for individuals and businesses across India.
          </p>
          <div className="flex gap-3">
            {[
              { icon: Instagram, href: "https://www.instagram.com/trikriti.studio?igsh=eWZwNzBlaDZtcHZu", label: "Instagram" },
              
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 border border-gray-700 flex items-center justify-center hover:border-brand-red hover:bg-brand-red transition-colors duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
            Quick Links
          </h4>
          <ul className="space-y-2.5">
            {[
              { label: "All Products", href: "/products" },
              { label: "Custom Printing", href: "/custom" },
              { label: "Track Your Order", href: "/track-order" },
              { label: "Blog & Reels", href: "/blog" },
              { label: "Contact Us", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-gray-400 text-sm hover:text-brand-red transition-colors font-body"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
            Legal
          </h4>
          <ul className="space-y-2.5">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Refund Policy", href: "/terms#refund" },
              { label: "Shipping Policy", href: "/terms#shipping" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-gray-400 text-sm hover:text-brand-red transition-colors font-body"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">
            Contact
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-gray-400 text-sm">
              <Mail size={14} className="mt-0.5 text-brand-red shrink-0" />
              <a href="mailto:studiotrikriti@gmail.com" className="hover:text-brand-red transition-colors">
                studiotrikriti@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2.5 text-gray-400 text-sm">
              <Phone size={14} className="mt-0.5 text-brand-red shrink-0" />
              <span>+91 9175825605</span>
            </li>
            <li className="flex items-start gap-2.5 text-gray-400 text-sm">
              <Phone size={14} className="mt-0.5 text-brand-red shrink-0" />
              <span>+91 7841059939</span>
            </li>
            <li className="flex items-start gap-2.5 text-gray-400 text-sm">
              <MapPin size={14} className="mt-0.5 text-brand-red shrink-0" />
              <span>India</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs font-body">
            © {new Date().getFullYear()} Trikriti Studio. All rights reserved.
          </p>
          <p className="text-blue-600 text-xs font-body">
            Made by 1o X SharpTechnologies with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
