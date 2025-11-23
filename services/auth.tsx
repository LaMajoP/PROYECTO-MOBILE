// services/auth.ts
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// ----------- TYPES -------------
type AuthContextType = {
  user: any | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (name: string, email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
};

// ----------- CONTEXT -------------
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

// ----------- PROVIDER -------------
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Escuchar sesión de Supabase
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // ----------- METHODS -------------
  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (name: string, email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto
export const useAuth = () => useContext(AuthContext);
