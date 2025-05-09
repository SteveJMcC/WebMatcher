"use client";

import { useState, useEffect, useCallback } from 'react';

type UserType = 'user' | 'designer' | null;

export interface AuthState {
  isAuthenticated: boolean;
  userType: UserType;
  username: string | null;
  userId: string | null;
  profileSetupComplete: boolean;
  isLoading: boolean;
  login: (type: 'user' | 'designer', name: string, id?: string) => void;
  logout: () => void;
  markProfileComplete: () => void;
}

export const useAuthMock = (): AuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('mockAuth');
      if (storedAuth) {
        const { 
          isAuthenticated: auth, 
          userType: type, 
          username: name, 
          userId: id, 
          profileSetupComplete: psc 
        } = JSON.parse(storedAuth);
        setIsAuthenticated(auth);
        setUserType(type);
        setUsername(name);
        setUserId(id || null);
        setProfileSetupComplete(psc || false);
      }
    } catch (error) {
      console.error("Failed to parse mockAuth from localStorage", error);
      localStorage.removeItem('mockAuth');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((type: 'user' | 'designer', name: string, id?: string) => {
    const newUserId = id || `mock-${type}-${Date.now()}`;
    setIsAuthenticated(true);
    setUserType(type);
    setUsername(name);
    setUserId(newUserId);
    setProfileSetupComplete(false); // Profile setup is not complete on new login
    try {
      localStorage.setItem('mockAuth', JSON.stringify({ 
        isAuthenticated: true, 
        userType: type, 
        username: name, 
        userId: newUserId,
        profileSetupComplete: false 
      }));
    } catch (error)_ {
      console.error("Failed to set mockAuth in localStorage", error);
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserType(null);
    setUsername(null);
    setUserId(null);
    setProfileSetupComplete(false);
    try {
      localStorage.removeItem('mockAuth');
    } catch (error) {
      console.error("Failed to remove mockAuth from localStorage", error);
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/'; // Redirect to home on logout
    }
  }, []);

  const markProfileComplete = useCallback(() => {
    if (isAuthenticated) {
      setProfileSetupComplete(true);
      try {
        localStorage.setItem('mockAuth', JSON.stringify({ 
          isAuthenticated, 
          userType, 
          username, 
          userId, 
          profileSetupComplete: true 
        }));
      } catch (error) {
        console.error("Failed to update mockAuth in localStorage for profile completion", error);
      }
    }
  }, [isAuthenticated, userType, username, userId]);

  return { isAuthenticated, userType, username, userId, profileSetupComplete, isLoading, login, logout, markProfileComplete };
};
