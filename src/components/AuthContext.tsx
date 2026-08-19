import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";
import type { Role } from "../types";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  mfaEnabled: boolean;
}

const DEMO_PROFILES: Record<string, { role: Role; name: string }> = {
  "admin.demo@hpis.example": { role: "SUPER_ADMIN", name: "System Administrator" },
  "manager.demo@hpis.example": { role: "PROGRAM_MANAGER", name: "Abebe Bikila (Program Mgr)" },
  "officer.demo@hpis.example": { role: "PROTECTION_OFFICER", name: "Sara Tefera (Protection Off.)" },
  "worker.demo@hpis.example": { role: "CASE_WORKER", name: "Dawit Kebede (Case Worker)" },
  "data.demo@hpis.example": { role: "DATA_OFFICER", name: "Hiwot Haile (Data Officer)" },
  "field.demo@hpis.example": { role: "FIELD_OFFICER", name: "Yonas Girma (Field Officer)" },
  "auditor.demo@hpis.example": { role: "AUDITOR", name: "Helen Assefa (Auditor)" },
  "viewer.demo@hpis.example": { role: "VIEWER", name: "Observer Account (Viewer)" },
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  role: Role | null;
  loading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithOtp: (email: string) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  enrollMfa: () => Promise<{ id?: string; qrCode?: string; secret?: string; uri?: string; error?: string }>;
  verifyMfa: (factorId: string, challengeId: string, code: string) => Promise<{ error?: string }>;
  unenrollMfa: (factorId: string) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  signInWithPassword: async () => ({ error: null }),
  signInWithOtp: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  signOut: async () => {},
  enrollMfa: async () => ({ error: "Not initialized" }),
  verifyMfa: async () => ({ error: "Not initialized" }),
  unenrollMfa: async () => ({ error: "Not initialized" }),
  refreshProfile: async () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  const applyProfile = (userId: string, email: string, userRole: Role, fullName: string, mfa: boolean = false) => {
    const prof: UserProfile = {
      id: userId,
      email,
      fullName,
      role: userRole,
      mfaEnabled: mfa
    };
    setProfile(prof);
    setRole(userRole);
  };

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, mfa_enabled')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        applyProfile(userId, email, data.role as Role, data.full_name, data.mfa_enabled);
        return;
      }
    } catch (e) {
      console.warn("Supabase profiles query unavailable");
    }

    // DEMO-ONLY fallback, active only when VITE_DEMO_MODE=true. Never enable in a real deployment.
    if (isDemoMode && DEMO_PROFILES[email]) {
      const demo = DEMO_PROFILES[email];
      applyProfile(userId, email, demo.role, demo.name);
    } else {
      applyProfile(userId, email, "VIEWER", email.split("@")[0]);
    }
  };

  const refreshProfile = async () => {
    if (user?.email && user?.id) {
      await fetchProfile(user.id, user.email);
    }
  };

  useEffect(() => {
    // Check existing stored session
    const storedDemo = localStorage.getItem("hpis_demo_session");
    if (storedDemo && isDemoMode) {
      try {
        const parsed = JSON.parse(storedDemo);
        setUser({ id: parsed.id, email: parsed.email } as User);
        applyProfile(parsed.id, parsed.email, parsed.role, parsed.fullName, parsed.mfaEnabled);
        setLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem("hpis_demo_session");
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        fetchProfile(session.user.id, session.user.email).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        fetchProfile(session.user.id, session.user.email).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemoMode]);

  const signInWithPassword = async (email: string, password: string): Promise<{ error: string | null }> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // DEMO-ONLY fallback, active only when VITE_DEMO_MODE=true. Never enable in a real deployment.
        if (isDemoMode && DEMO_PROFILES[email] && password === "demo1234") {
          const demo = DEMO_PROFILES[email];
          const demoUser = { id: `00000000-0000-0000-0000-${email.length.toString().padStart(12, '0')}`, email } as User;
          const prof: UserProfile = {
            id: demoUser.id,
            email,
            fullName: demo.name,
            role: demo.role,
            mfaEnabled: false
          };
          localStorage.setItem("hpis_demo_session", JSON.stringify(prof));
          setUser(demoUser);
          setProfile(prof);
          setRole(demo.role);
          setLoading(false);
          return { error: null };
        }
        setLoading(false);
        return { error: error.message };
      }

      if (data.user?.email) {
        await fetchProfile(data.user.id, data.user.email);
      }
      setLoading(false);
      return { error: null };
    } catch (err: any) {
      // DEMO-ONLY fallback, active only when VITE_DEMO_MODE=true. Never enable in a real deployment.
      if (isDemoMode && DEMO_PROFILES[email] && password === "demo1234") {
        const demo = DEMO_PROFILES[email];
        const demoUser = { id: `00000000-0000-0000-0000-000000000001`, email } as User;
        const prof: UserProfile = {
          id: demoUser.id,
          email,
          fullName: demo.name,
          role: demo.role,
          mfaEnabled: false
        };
        localStorage.setItem("hpis_demo_session", JSON.stringify(prof));
        setUser(demoUser);
        setProfile(prof);
        setRole(demo.role);
        setLoading(false);
        return { error: null };
      }
      setLoading(false);
      return { error: err.message || "Failed to sign in" };
    }
  };

  const signInWithOtp = async (email: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message || "Failed to send magic link" };
    }
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err.message || "Failed to send password reset email" };
    }
  };

  // ----------------------------------------------------------------------
  // Supabase Auth Native MFA (TOTP) Methods
  // ----------------------------------------------------------------------
  const enrollMfa = async (): Promise<{ id?: string; qrCode?: string; secret?: string; uri?: string; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'HPIS Security'
      });
      if (error) return { error: error.message };
      return {
        id: data.id,
        qrCode: data.totp?.qr_code,
        secret: data.totp?.secret,
        uri: data.totp?.uri
      };
    } catch (err: any) {
      return { error: err.message || "Failed to enroll MFA factor" };
    }
  };

  const verifyMfa = async (factorId: string, challengeId: string, code: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code
      });
      if (error) return { error: error.message };

      if (profile) {
        setProfile({ ...profile, mfaEnabled: true });
      }
      return {};
    } catch (err: any) {
      return { error: err.message || "Failed to verify MFA challenge" };
    }
  };

  const unenrollMfa = async (factorId: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) return { error: error.message };

      if (profile) {
        setProfile({ ...profile, mfaEnabled: false });
      }
      return {};
    } catch (err: any) {
      return { error: err.message || "Failed to unenroll MFA factor" };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("hpis_demo_session");
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role,
      loading,
      signInWithPassword,
      signInWithOtp,
      resetPassword,
      signOut,
      enrollMfa,
      verifyMfa,
      unenrollMfa,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
