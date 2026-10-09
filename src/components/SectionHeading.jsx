// src/components/SectionHeading.jsx
import Reveal from "./Reveal";

const SectionHeading = ({
  eyebrow,
  title,
  description,
  dark = false,
  align = "left",
  children,
}) => {
  const centered = align === "center";

  return (
    <Reveal
      className={`mb-14 flex flex-col gap-6 md:mb-16 ${
        centered
          ? "items-center text-center"
          : "lg:flex-row lg:items-end lg:justify-between"
      }`}
    >
      <div className={centered ? "max-w-3xl" : "max-w-2xl"}>
        {eyebrow && (
          <span className={`eyebrow mb-5 ${dark ? "!text-brand-300" : ""}`}>
            {eyebrow}
          </span>
        )}
        <h2 className={`display ${dark ? "text-white" : "text-ink"}`}>
          {title}
        </h2>
      </div>
      {(description || children) && (
        <div className={centered ? "max-w-2xl" : "max-w-md lg:pb-2"}>
          {description && (
            <p
              className={`text-lg leading-relaxed ${
                dark ? "text-brand-100/70" : "text-slate-600"
              }`}
            >
              {description}
            </p>
          )}
          {children}
        </div>
      )}
    </Reveal>
  );
};

export default SectionHeading;
