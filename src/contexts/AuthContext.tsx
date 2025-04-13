
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { showActionToast } from '@/utils/toast-utils';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, options?: { metadata?: { [key: string]: any } }) => Promise<{
    user: User | null;
    error: Error | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    user: User | null;
    error: Error | null;
  }>;
  signOut: () => Promise<void>;
  updateUserData: (data: { [key: string]: any }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial auth state check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    options?: { metadata?: { [key: string]: any } }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      });

      if (error) {
        showActionToast(`Error signing up: ${error.message}`);
        return { user: null, error };
      }

      showActionToast('Signup successful! Check your email for confirmation.');
      return { user: data.user, error: null };
    } catch (error) {
      showActionToast(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      return { user: null, error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        showActionToast(`Error signing in: ${error.message}`);
        return { user: null, error };
      }

      showActionToast('Signed in successfully!');
      return { user: data.user, error: null };
    } catch (error) {
      showActionToast(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      return { user: null, error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        showActionToast(`Error signing out: ${error.message}`);
        return;
      }

      showActionToast('Signed out successfully');
    } catch (error) {
      showActionToast(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const updateUserData = async (data: { [key: string]: any }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data
      });

      if (error) {
        showActionToast(`Error updating user data: ${error.message}`);
        return;
      }

      showActionToast('User data updated successfully');
    } catch (error) {
      showActionToast(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
