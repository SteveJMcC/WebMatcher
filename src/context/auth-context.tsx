'use client';

import { ReactNode, createContext, useContext } from 'react';
// Alias the Firebase hook so it doesn’t collide with the context hook
import { useAuth as useFirebaseAuth } from '@/hooks/use-auth';

type FirebaseAuthReturn = ReturnType<typeof useFirebaseAuth>;

const AuthContext = createContext<FirebaseAuthReturn | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Call the aliased Firebase hook here
  const auth = useFirebaseAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

