// src/components/Clients.jsx
import Reveal from "./Reveal";
import { useContent } from "../content/ContentContext";
import { assetUrl } from "../lib/api";

const Clients = () => {
  const { clients: section } = useContent();
  const clients = section.items;

  // Two copies: the track slides by exactly half its width for a seamless loop
  const track = [...clients, ...clients];

  return (
    <section
      id="clients"
      className="overflow-hidden border-y border-slate-200 bg-white py-16 md:py-20"
    >
      <div className="shell">
        <Reveal className="mb-10 flex flex-col items-center gap-3 text-center">
          <span className="eyebrow">{section.eyebrow}</span>
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
            {section.title}
          </h2>
        </Reveal>
      </div>

      {/* Single row – infinite horizontal scroll, pauses on hover */}
      <div className="marquee-mask relative">
        <ul className="flex w-max animate-marquee items-center">
          {track.map((client, index) => (
            <li
              key={`${client.name}-${index}`}
              aria-hidden={index >= clients.length}
              className="mx-3 flex h-24 w-44 flex-shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white px-6"
            >
              <img
                src={assetUrl(client.logo)}
                alt={client.name}
                loading="lazy"
                className="max-h-12 max-w-full object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Clients;
