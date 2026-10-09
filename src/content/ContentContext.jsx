// src/content/ContentContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import defaults from "./defaults";
import { API_URL } from "../lib/api";

const CACHE_KEY = "proaddis-content-v2";

// System settings the server shares with the website (managed in the admin
// under Settings). These apply until the server answers, or if it cannot.
const SYSTEM_DEFAULTS = {
  contactForm: {
    enabled: true,
    fields: {},
    successMessage:
      "Thank you! Your message has been sent successfully. We'll get back to you soon.",
  },
  analytics: { enabled: false, measurementId: "" },
};

const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// Saved sections override the built-in ones field by field, so a field added
// to the defaults later still shows up for a section saved before it existed.
// `response` is the body of GET /api/content: { content, contactForm, analytics }
export const mergeContent = (response) => {
  const saved = response?.content;
  const merged = {};
  for (const key of Object.keys(defaults)) {
    merged[key] = {
      ...defaults[key],
      ...(isPlainObject(saved?.[key]) ? saved[key] : {}),
    };
  }
  for (const key of Object.keys(SYSTEM_DEFAULTS)) {
    merged[key] = {
      ...SYSTEM_DEFAULTS[key],
      ...(isPlainObject(response?.[key]) ? response[key] : {}),
    };
  }
  return merged;
};

const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY));
  } catch {
    return null;
  }
};

export const fetchContent = async () => {
  const response = await fetch(`${API_URL}/api/content`);
  if (!response.ok) throw new Error(`Content request failed (${response.status})`);
  return response.json();
};

const ContentContext = createContext(mergeContent(null));

export const ContentProvider = ({ children }) => {
  // Start from the last content this browser saw (or the built-in content)
  // so the page renders immediately, then refresh from the server.
  const [content, setContent] = useState(() => mergeContent(readCache()));

  useEffect(() => {
    let cancelled = false;

    fetchContent()
      .then((saved) => {
        if (cancelled) return;
        setContent(mergeContent(saved));
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(saved));
        } catch {
          // Storage unavailable: the page still works, just without the cache
        }
      })
      .catch((error) => {
        console.warn("Using built-in content:", error.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the document title and description in sync with the settings
  useEffect(() => {
    const { seoTitle, seoDescription } = content.settings;
    if (seoTitle) document.title = seoTitle;
    if (seoDescription) {
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", seoDescription);
    }
  }, [content.settings]);

  // Load Google Analytics only when it is switched on in the admin
  const { enabled: analyticsOn, measurementId } = content.analytics;
  useEffect(() => {
    if (!analyticsOn || !/^G-[A-Z0-9]+$/.test(measurementId)) return;
    if (document.getElementById("ga-script")) return;

    const script = document.createElement("script");
    script.id = "ga-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", measurementId);
  }, [analyticsOn, measurementId]);

  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
