"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/use-auth';

const AuthContext = createContext<ReturnType<typeof useAuth> | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthMock();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
