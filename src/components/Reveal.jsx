// src/components/Reveal.jsx
import useInView from "../hooks/useInView";

// Fades children up when scrolled into view. Keep hover transforms on a child
// element, not on Reveal itself, so they don't inherit the reveal delay.
const Reveal = ({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
  ...rest
}) => {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
