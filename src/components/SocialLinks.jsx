// src/components/SocialLinks.jsx
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  Link as LinkIcon,
} from "lucide-react";
import { useContent } from "../content/ContentContext";

const platformIcons = {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  Telegram: Send,
};

export const socialPlatforms = Object.keys(platformIcons);

const SocialLinks = ({ className = "" }) => {
  const { settings } = useContent();
  const socials = (settings.socials || []).filter((social) => social.url);

  if (socials.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {socials.map((social, index) => {
        const Icon = platformIcons[social.platform] || LinkIcon;
        const external = /^https?:/i.test(social.url);
        return (
          <a
            key={`${social.platform}-${index}`}
            href={social.url}
            aria-label={social.platform}
            title={social.platform}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-brand-100/80 transition-colors duration-200 hover:border-brand-300 hover:bg-brand-600 hover:text-white"
          >
            <Icon size={17} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
