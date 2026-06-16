import { useEffect, useState } from 'react';

const TOKEN_KEY = 'algoquizr_token';
const USER_KEY = 'algoquizr_user';
const AUTH_EVENT = 'algoquizr_auth_change';

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  plan: 'Free' | 'Pro';
  createdAt: string;
}

function readUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Real auth state, backed by a JWT issued by the backend.
 * - `token` is sent as `Authorization: Bearer <token>` on protected requests.
 * - `user` is the profile returned at login/register time.
 * - `isLoggedIn` is just `!!token`, for convenience (e.g. Navbar routing).
 */
export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => readUser());

  useEffect(() => {
    const sync = () => {
      setToken(localStorage.getItem(TOKEN_KEY));
      setUser(readUser());
    };
    window.addEventListener('storage', sync);   // other tabs
    window.addEventListener(AUTH_EVENT, sync);  // same tab
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(AUTH_EVENT, sync);
    };
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    window.dispatchEvent(new Event(AUTH_EVENT));
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  };

  return { token, user, isLoggedIn: !!token, login, logout };
}