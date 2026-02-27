import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const PROFILE_SELECT =
  "id,user_id,display_name,avatar_url,onboarding_completed,resume_uploaded,created_at,updated_at";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  resumeUploaded: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  markResumeUploaded: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const fetchOrCreateProfile = async (authUser: User): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select(PROFILE_SELECT)
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (error) {
      console.error("Failed to load profile:", error);
      return null;
    }

    if (data) {
      return data;
    }

    const { data: createdProfile, error: createError } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: authUser.id,
          display_name: authUser.user_metadata?.display_name ?? null,
          resume_uploaded: false,
        },
        { onConflict: "user_id" }
      )
      .select(PROFILE_SELECT)
      .single();

    if (createError) {
      console.error("Failed to create missing profile:", createError);
      return null;
    }

    return createdProfile;
  };

  useEffect(() => {
    let active = true;

    const syncAuthState = async (nextSession: Session | null) => {
      if (!active) return;

      const nextUser = nextSession?.user ?? null;
      setSession(nextSession);
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setIsProfileLoading(false);
        setIsLoading(false);
        return;
      }

      setIsProfileLoading(true);
      const nextProfile = await fetchOrCreateProfile(nextUser);

      if (!active) return;
      setProfile(nextProfile);
      setIsProfileLoading(false);
      setIsLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, nextSession) => {
        await syncAuthState(nextSession);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      await syncAuthState(initialSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const markResumeUploaded = async () => {
    if (!user) {
      return { error: new Error("User not authenticated") };
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: user.id,
          display_name: profile?.display_name ?? user.user_metadata?.display_name ?? null,
          resume_uploaded: true,
        },
        { onConflict: "user_id" }
      )
      .select(PROFILE_SELECT)
      .single();

    if (error) {
      return { error: new Error(error.message) };
    }

    setProfile(data);
    return { error: null };
  };

  const resumeUploaded = useMemo(() => Boolean(profile?.resume_uploaded), [profile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        resumeUploaded,
        isLoading,
        isProfileLoading,
        signUp,
        signIn,
        signOut,
        markResumeUploaded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
