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
        const response = await axios.get(`${API}/api/user/me`, { withCredentials: true });
        if (active && response.data) dispatch(login(response.data));
      } catch {
        // Visitors without a valid session remain signed out.
      } finally {
        if (active) setAuthChecked(true);
      }
    };
    restoreSession();
    return () => { active = false; };
  }, [dispatch, user]);

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

  const links = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  const linkClass = (href) =>
    `text-sm font-medium transition-colors ${pathname === href ? "text-orange-300" : "text-white/90 hover:text-orange-200"}`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-orangeDark/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" onClick={closeMenu} className="text-xl font-bold tracking-wide text-white">
          Nutri<span className="text-orange-300">Blog</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(link.href)}>{link.name}</Link>
          ))}

          {!authChecked ? (
            <span className="h-8 w-20 animate-pulse rounded-full bg-white/20" />
          ) : user?.role === "admin" ? (
            <>
              <Link href="/admin" className={linkClass("/admin")}>Dashboard</Link>
              <span className="max-w-32 truncate text-sm text-orange-100" title={user.userName || user.email}>
                {user.userName || user.email}
              </span>
              <button type="button" onClick={handleLogout} disabled={loggingOut} className="text-sm font-semibold text-white transition hover:text-orange-200 disabled:opacity-60">
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : user ? (
            <>
              <span className="max-w-32 truncate text-sm text-orange-100">{user.userName || user.email}</span>
              <button type="button" onClick={handleLogout} disabled={loggingOut} className="text-sm font-semibold text-white hover:text-orange-200 disabled:opacity-60">
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-white hover:text-orange-200">Login</Link>
              <Link href="/signup" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50">Sign Up</Link>
            </>
          )}
        </div>

        <button type="button" aria-label={open ? "Close navigation menu" : "Open navigation menu"} aria-expanded={open} className="text-white md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-6 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenu} className={`text-base font-medium ${pathname === link.href ? "text-orange-600" : "text-gray-700"}`}>
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
              {!authChecked ? <span className="text-sm text-gray-500">Checking login...</span> : user?.role === "admin" ? (
                <>
                  <Link href="/admin" onClick={closeMenu} className="font-semibold text-orange-700">Dashboard</Link>
                  <span className="text-sm text-gray-500">{user.userName || user.email}</span>
                  <button type="button" onClick={handleLogout} disabled={loggingOut} className="rounded-full bg-orange-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{loggingOut ? "Logging out..." : "Logout"}</button>
                </>
              ) : user ? (
                <>
                  <span className="text-sm text-gray-600">{user.userName || user.email}</span>
                  <button type="button" onClick={handleLogout} disabled={loggingOut} className="rounded-full bg-orange-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{loggingOut ? "Logging out..." : "Logout"}</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={closeMenu} className="py-2 text-center font-semibold text-gray-800">Login</Link>
                  <Link href="/signup" onClick={closeMenu} className="rounded-full bg-orange-500 px-4 py-3 text-center font-semibold text-white">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
