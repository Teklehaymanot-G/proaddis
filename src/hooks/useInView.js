// src/hooks/useInView.js
import { useEffect, useRef, useState } from "react";

// Returns [ref, inView]. Flips to true the first time the element scrolls in.
const useInView = ({ threshold = 0.15, rootMargin = "0px 0px -8% 0px" } = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
};

export default useInView;
