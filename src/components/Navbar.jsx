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

  const closeMenu = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-orangeDark/90 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" onClick={closeMenu} className="text-xl font-bold text-white tracking-wide">
          Nutri<span className="text-orange-300">Blog</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition ${isActive ? "text-orange-300" : "text-white hover:text-orange-200"}`}
              >
                {link.name}
                <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-orange-300 transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0"}`} />
              </Link>
            );
          })}

          <Link href="/login" className="text-sm font-semibold text-white hover:text-orange-200 transition">
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-full bg-white text-orange-700 text-sm font-semibold hover:bg-orange-50 transition"
          >
            Sign Up
          </Link>
          <Link
            href="/blog"
            className="px-4 py-2 rounded-full bg-orange-400 text-white text-sm font-semibold hover:bg-orange-500 transition"
          >
            Read Blog
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-[32rem]" : "max-h-0"}`}>
        <div className="px-6 py-5 flex flex-col gap-5 bg-white shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className={`text-base font-medium transition ${pathname === link.href ? "text-orange-600" : "text-gray-700"}`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
            <Link href="/login" onClick={closeMenu} className="text-center text-gray-800 font-semibold py-2">
              Login
            </Link>
            <Link href="/signup" onClick={closeMenu} className="text-center px-4 py-3 rounded-full bg-orange-500 text-white font-semibold">
              Create an account
            </Link>
            <Link href="/blog" onClick={closeMenu} className="text-center px-4 py-3 rounded-full border border-orange-300 text-orange-700 font-semibold">
              Read Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
