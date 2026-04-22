"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function useScrollDepth() {
  const pathname = usePathname();
  const tracked = useRef(new Set());

  useEffect(() => {
    const start = Date.now();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;

      const thresholds = [25, 50, 75, 100];

      thresholds.forEach((level) => {
        if (scrolled >= level && !tracked.current.has(level)) {
          tracked.current.add(level);

          window.gtag?.("event", "scroll_depth", {
            event_category: "engagement",
            event_label: pathname,
            value: level,
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);

      const timeSpent = Math.round((Date.now() - start) / 1000);

      window.gtag?.("event", "time_on_page", {
        event_category: "engagement",
        event_label: pathname,
        value: timeSpent,
      });
    };
  }, [pathname]);
}