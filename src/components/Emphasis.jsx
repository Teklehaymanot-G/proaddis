// src/components/Emphasis.jsx

// Renders text where **double asterisks** mark highlighted words
const Emphasis = ({ text, className }) =>
  String(text || "")
    .split("**")
    .map((part, index) =>
      index % 2 === 1 ? (
        <span key={index} className={className}>
          {part}
        </span>
      ) : (
        part
      ),
    );

export default Emphasis;
