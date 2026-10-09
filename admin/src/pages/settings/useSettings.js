// src/pages/settings/useSettings.js
import { useCallback, useEffect, useState } from "react";
import { api } from "../../api/client";

// Loads the system settings ({ smtp, contactForm, analytics, envRecipient })
const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setSettings(await api.getSettings());
    } catch (loadError) {
      setError(loadError.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Merge a saved part back in, e.g. patch({ smtp })
  const patch = useCallback(
    (part) => setSettings((current) => ({ ...current, ...part })),
    [],
  );

  return { settings, error, load, patch };
};

export default useSettings;
