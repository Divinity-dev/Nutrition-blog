"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-orangeDark/90 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white tracking-wide">
          Nutri<span className="text-orange-300">Blog</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition 
                  ${isActive ? "text-orange-300" : "text-white hover:text-orange-200"}
                `}
              >
                {link.name}

                {/* Underline animation */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-full bg-orange-300 transition-transform duration-300 
                  ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                />
              </Link>
            );
          })}

          {/* CTA Button */}
          <Link
            href="/blog"
            className="ml-4 px-4 py-2 rounded-full bg-orange-400 text-white text-sm font-semibold hover:bg-orange-500 transition"
          >
            Read Blog
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-5 bg-white shadow-lg">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-base font-medium transition ${
                  isActive ? "text-orange-500" : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Mobile CTA */}
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className="mt-2 text-center px-4 py-2 rounded-full bg-orange-400 text-white font-semibold"
          >
            Read Blog
          </Link>
        </div>
      </div>
    </nav>
  );
}