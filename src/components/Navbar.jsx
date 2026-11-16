"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/authslice";
import { toast } from "react-toastify";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      if (user) {
        setAuthChecked(true);
        return;
      }

      try {
        const response = await axios.get(`${API}/api/user/me`, {
          withCredentials: true,
        });
        if (active && response.data) dispatch(login(response.data));
      } catch {
        // A missing or expired session simply means the visitor is logged out.
      } finally {
        if (active) setAuthChecked(true);
      }
    };

    restoreSession();
    return () => {
      active = false;
    };
  }, [dispatch, user]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ];

  const adminLinks = user?.role === "admin"
    ? [
        { name: "Create Article", href: "/create" },
        { name: "AI Drafts", href: "/admin/drafts" },
        { name: "Comments", href: "/admin/comments" },
        { name: "AI Automation", href: "/admin/ai-schedule" },
      ]
    : [];

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await axios.post(`${API}/api/user/logout`, {}, { withCredentials: true });
      dispatch(logout());
      closeMenu();
      toast.success("You have been logged out.");
      router.replace("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const linkClass = (href) =>
    `relative text-sm font-medium transition ${pathname === href ? "text-orange-300" : "text-white hover:text-orange-200"}`;

  return (
    <nav className="sticky top-0 z-50 bg-orangeDark/90 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" onClick={closeMenu} className="text-xl font-bold text-white tracking-wide">
          Nutri<span className="text-orange-300">Blog</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className={linkClass(link.href)}>
              {link.name}
              <span className={`absolute left-0 -bottom-1 h-[2px] w-full bg-orange-300 transition-transform duration-300 ${pathname === link.href ? "scale-x-100" : "scale-x-0"}`} />
            </Link>
          ))}

          {adminLinks.map((link) => (
            <Link key={link.name} href={link.href} className={linkClass(link.href)}>
              {link.name}
            </Link>
          ))}

          {!authChecked ? (
            <span className="h-8 w-24 animate-pulse rounded-full bg-white/20" aria-label="Checking login status" />
          ) : user ? (
            <>
              <span className="max-w-32 truncate text-sm text-orange-100" title={user.userName || user.email}>
                {user.userName || user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-orange-200 transition disabled:opacity-60"
              >
                <LogOut size={16} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-white hover:text-orange-200 transition">
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full bg-white text-orange-700 text-sm font-semibold hover:bg-orange-50 transition"
              >
                Sign Up
              </Link>
            </>
          )}

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

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-[42rem]" : "max-h-0"}`}>
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

          {adminLinks.map((link) => (
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
            {!authChecked ? (
              <span className="text-center text-sm text-gray-500">Checking login status...</span>
            ) : user ? (
              <>
                <span className="text-center text-sm font-medium text-gray-600">
                  Signed in as {user.userName || user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center justify-center gap-2 rounded-full bg-orange-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
                >
                  <LogOut size={17} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu} className="text-center text-gray-800 font-semibold py-2">
                  Login
                </Link>
                <Link href="/signup" onClick={closeMenu} className="text-center px-4 py-3 rounded-full bg-orange-500 text-white font-semibold">
                  Create an account
                </Link>
              </>
            )}
            <Link href="/blog" onClick={closeMenu} className="text-center px-4 py-3 rounded-full border border-orange-300 text-orange-700 font-semibold">
              Read Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
