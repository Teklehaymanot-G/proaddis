// src/lib/analytics.js
import { useEffect } from "react";

// Sends an event to Google Analytics when the tag is loaded; otherwise no-op.
// Never pass personal details (names, emails, message text) as parameters.
export const track = (eventName, params) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
};

// Sections reported to Analytics, by element id. The admin's Analytics page
// reads these back by event name (server/lib/analytics.js), so keep the
// "section_view_" prefix and this list in sync with it.
export const TRACKED_SECTIONS = [
  "about",
  "services",
  "process",
  "clients",
  "portfolio",
  "case-studies",
  "testimonials",
  "contact",
];

export const sectionEventName = (id) => `section_view_${id.replace(/-/g, "_")}`;

export const CONTACT_SENT_EVENT = "contact_form_sent";

// How long a section must stay mid-screen before it counts as seen. This
// skips sections flown past while scrolling, and the moment during page load
// when the hero video has no height yet and the first section sits mid-screen.
const DWELL_MS = 1000;

// Reports each section once per visit, when it has been in the middle of the
// screen for DWELL_MS.
export const useSectionTracking = () => {
  useEffect(() => {
    const timers = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target;
          clearTimeout(timers.get(section));

          if (!entry.isIntersecting) return;

          timers.set(
            section,
            setTimeout(() => {
              track(sectionEventName(section.id));
              observer.unobserve(section);
            }, DWELL_MS),
          );
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    TRACKED_SECTIONS.map((id) => document.getElementById(id))
      .filter(Boolean)
      .forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);
};
