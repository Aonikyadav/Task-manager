import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5002";

interface BackendUser { id: string; email: string; name?: string; role?: string; emailVerified?: boolean; lastLoginAt?: string }
interface AuthContextType {
  user: BackendUser | null;
  session: { token: string } | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [session, setSession] = useState<{ token: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (token && userRaw) {
      setSession({ token });
      try { setUser(JSON.parse(userRaw)); } catch { setUser(null); }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) return { error: new Error("Registration failed") };
      const json = await res.json();
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));
      setSession({ token: json.token });
      setUser(json.user);
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e : new Error("Unknown error") };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) return { error: new Error("Login failed") };
      const json = await res.json();
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));
      setSession({ token: json.token });
      setUser(json.user);
      return { error: null };
    } catch (e) {
      return { error: e instanceof Error ? e : new Error("Unknown error") };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
