// src/auth/AuthContext.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken, SESSION_EXPIRED } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // status: "loading" while an existing session is being checked
  const [status, setStatus] = useState(getToken() ? "loading" : "signedOut");
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState("");
  // After choosing "Sign out" the next sign-in starts at the dashboard
  // instead of returning to the page the previous person was on.
  const [signedOutByChoice, setSignedOutByChoice] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const result = await api.me();
      setUser(result.user);
      setStatus("signedIn");
    } catch {
      setUser(null);
      setStatus("signedOut");
    }
  }, []);

  useEffect(() => {
    if (getToken()) refresh();
  }, [refresh]);

  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setStatus("signedOut");
      setNotice("Your session has ended. Please sign in again.");
    };
    window.addEventListener(SESSION_EXPIRED, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED, onExpired);
  }, []);

  const signIn = useCallback(async (email, password) => {
    const result = await api.login(email, password);
    setToken(result.token);
    setUser(result.user);
    setNotice("");
    setSignedOutByChoice(false);
    setStatus("signedIn");
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setUser(null);
    setNotice("");
    setSignedOutByChoice(true);
    setStatus("signedOut");
  }, []);

  const value = useMemo(() => {
    const permissions = user?.permissions || [];
    return {
      status,
      user,
      notice,
      signedOutByChoice,
      setUser,
      refresh,
      signIn,
      signOut,
      // True when the user holds at least one of the given permissions
      can: (...keys) => keys.some((key) => permissions.includes(key)),
    };
  }, [status, user, notice, signedOutByChoice, refresh, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
