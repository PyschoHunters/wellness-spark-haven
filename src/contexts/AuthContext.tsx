import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { showActionToast } from '@/utils/toast-utils';

interface User {
  id: string;
  email: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { user } = session;
          setUser({
            id: user.id,
            email: user.email || '',
            avatar_url: (user as any).user_metadata?.avatar_url,
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session && session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            avatar_url: (session.user as any).user_metadata?.avatar_url,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      navigate('/');
      showActionToast('Signed in successfully!');
    } catch (error: any) {
      showActionToast(error.message || 'Error signing in');
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {} // Empty data object instead of metadata
        }
      });
      
      if (error) {
        throw error;
      }
      
      showActionToast('Signed up successfully! Check your email for confirmation.');
    } catch (error: any) {
      showActionToast(error.message || 'Error signing up');
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      showActionToast(error.message || 'Error signing in with GitHub');
      console.error('Error signing in with GitHub:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      navigate('/login');
      showActionToast('Signed out successfully!');
    } catch (error: any) {
      showActionToast(error.message || 'Error signing out');
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      setUser({
        ...user,
        avatar_url: avatarUrl
      });
      
      localStorage.setItem('userAvatarUrl', avatarUrl);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGithub,
    updateUserAvatar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
