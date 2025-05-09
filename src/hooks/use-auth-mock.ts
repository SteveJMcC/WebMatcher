// @ts-nocheck
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserProfileFormData } from '@/lib/schemas';

type UserType = 'user' | 'designer' | null;

// Interface for the data stored in localStorage
interface StoredAuthData {
  isAuthenticated: boolean;
  userType: UserType;
  username: string | null; // Login username
  userId: string | null;
  profileSetupComplete: boolean;
  displayName?: string; // Profile display name
  companyName?: string; // Client's company name
}

export interface AuthState {
  isAuthenticated: boolean;
  userType: UserType;
  username: string | null; // Login username
  userId: string | null;
  profileSetupComplete: boolean;
  isLoading: boolean;
  displayName: string | null; // Profile display name
  companyName: string | null; // Client's company name
  login: (type: 'user' | 'designer', username: string, id?: string) => void;
  logout: () => void;
  markProfileComplete: () => void; // Kept for designer or generic completion
  saveClientProfile: (profileData: UserProfileFormData) => void;
}

export const useAuthMock = (): AuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [username, setUsername] = useState<string | null>(null); // Login username
  const [userId, setUserId] = useState<string | null>(null);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null); // Profile display name
  const [companyName, setCompanyName] = useState<string | null>(null); // Client's company name

  useEffect(() => {
    try {
      const storedAuthString = localStorage.getItem('mockAuth');
      if (storedAuthString) {
        const storedAuth: StoredAuthData = JSON.parse(storedAuthString);
        setIsAuthenticated(storedAuth.isAuthenticated);
        setUserType(storedAuth.userType);
        setUsername(storedAuth.username);
        setUserId(storedAuth.userId || null);
        setProfileSetupComplete(storedAuth.profileSetupComplete || false);
        if (storedAuth.profileSetupComplete) {
          setDisplayName(storedAuth.displayName || storedAuth.username); // Fallback to username if displayName not set
          if (storedAuth.userType === 'user') {
            setCompanyName(storedAuth.companyName || null);
          }
        }
      }
    } catch (error) {
      console.error("Failed to parse mockAuth from localStorage", error);
      localStorage.removeItem('mockAuth');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((type: 'user' | 'designer', loginUsername: string, id?: string) => {
    // Check if there's existing data for this loginUsername and type
    // This mock assumes username is unique. A real app would query backend.
    let existingData: StoredAuthData | null = null;
    // For simplicity, we're not re-fetching by username here. 
    // The useEffect handles initial load. This login mainly sets new state or overrides.
    // In a multi-user mock, you might want to have separate localStorage keys per user or a more complex object.

    const newUserId = id || `mock-${type}-${Date.now()}`;
    
    // If localStorage had data for this specific user, it would have been loaded by useEffect.
    // This login function essentially starts a new session or continues one.
    // If a user "clientA" logs in, then "clientB" logs in, then "clientA" logs in again,
    // useEffect would load the last logged-in user's state. This mock is simple.

    setIsAuthenticated(true);
    setUserType(type);
    setUsername(loginUsername); // Set the login username
    setUserId(newUserId);

    // Attempt to load profile details if they were previously saved for this user
    // This part is tricky with a simple localStorage key. For this iteration,
    // we'll rely on the useEffect to load the last known state.
    // If logging in as a *different* user than was last stored, profile will appear blank until setup.
    // If logging in as the *same* user, useEffect would have already populated displayName, companyName, psc.
    // So, we only reset profileSetupComplete if it's not already true from initial load.
    
    const storedAuthString = localStorage.getItem('mockAuth');
    let pscFromStorage = false;
    let dnFromStorage = loginUsername; // Default display name to login username
    let cnFromStorage = null;

    if (storedAuthString) {
        try {
            const stored: StoredAuthData = JSON.parse(storedAuthString);
            // Simple check: if stored username and type match, use its profile status
            if (stored.username === loginUsername && stored.userType === type) {
                pscFromStorage = stored.profileSetupComplete;
                dnFromStorage = stored.displayName || loginUsername;
                if (type === 'user') {
                   cnFromStorage = stored.companyName || null;
                }
            }
        } catch (e) { /* ignore parsing error */ }
    }
    
    setProfileSetupComplete(pscFromStorage);
    setDisplayName(dnFromStorage);
    setCompanyName(cnFromStorage);


    try {
      const dataToStore: StoredAuthData = {
        isAuthenticated: true,
        userType: type,
        username: loginUsername,
        userId: newUserId,
        profileSetupComplete: pscFromStorage,
        displayName: dnFromStorage,
        companyName: type === 'user' ? cnFromStorage : undefined,
      };
      localStorage.setItem('mockAuth', JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Failed to set mockAuth in localStorage during login", error);
    }
  }, []);


  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserType(null);
    setUsername(null);
    setUserId(null);
    setProfileSetupComplete(false);
    setDisplayName(null);
    setCompanyName(null);
    try {
      localStorage.removeItem('mockAuth');
    } catch (error) {
      console.error("Failed to remove mockAuth from localStorage", error);
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/'; 
    }
  }, []);

  const markProfileComplete = useCallback(() => {
    // This is more generic, for designers or if client profile is completed elsewhere
    if (isAuthenticated) {
      setProfileSetupComplete(true);
      try {
        const currentDataString = localStorage.getItem('mockAuth');
        const currentData: StoredAuthData = currentDataString ? JSON.parse(currentDataString) : {} as StoredAuthData;
        
        localStorage.setItem('mockAuth', JSON.stringify({
          ...currentData, // Preserve existing data like username, userId, type
          isAuthenticated,
          userType, 
          username, 
          userId, 
          displayName: displayName || username, // Ensure displayName is set
          companyName: userType === 'user' ? companyName : undefined,
          profileSetupComplete: true,
        }));
      } catch (error) {
        console.error("Failed to update mockAuth in localStorage for profile completion", error);
      }
    }
  }, [isAuthenticated, userType, username, userId, displayName, companyName]);

  const saveClientProfile = useCallback((profileData: UserProfileFormData) => {
    if (isAuthenticated && userType === 'user') {
      setDisplayName(profileData.name);
      setCompanyName(profileData.companyName || null);
      setProfileSetupComplete(true);
      try {
        const dataToStore: StoredAuthData = {
          isAuthenticated: true,
          userType: 'user',
          username, // Persist login username
          userId,
          profileSetupComplete: true,
          displayName: profileData.name,
          companyName: profileData.companyName || undefined,
        };
        localStorage.setItem('mockAuth', JSON.stringify(dataToStore));
      } catch (error) {
        console.error("Failed to save client profile to localStorage", error);
      }
    }
  }, [isAuthenticated, userType, username, userId]);


  return { 
    isAuthenticated, 
    userType, 
    username, 
    userId, 
    profileSetupComplete, 
    isLoading, 
    displayName,
    companyName,
    login, 
    logout, 
    markProfileComplete,
    saveClientProfile,
  };
};
