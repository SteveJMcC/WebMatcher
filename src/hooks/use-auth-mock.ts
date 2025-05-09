// @ts-nocheck
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserProfileFormData, DesignerProfileFormData } from '@/lib/schemas';
import type { Tag } from '@/lib/types';

type UserType = 'user' | 'designer' | null;

interface StoredAuthData {
  isAuthenticated: boolean;
  userType: UserType;
  username: string | null; 
  userId: string | null;
  profileSetupComplete: boolean;

  // Shared profile name, set from either client or designer profile
  displayName?: string; 

  // Client specific
  companyName?: string; 

  // Designer specific
  // designerName is stored in displayName if userType is 'designer'
  designerHeadline?: string;
  designerAvatarUrl?: string;
  designerSkills?: Tag[];
  designerBio?: string;
  designerPortfolioLinks?: { title: string; url: string }[];
  designerBudgetMin?: number;
  designerBudgetMax?: number;
  designerEmail?: string; 
}

export interface AuthState {
  isAuthenticated: boolean;
  userType: UserType;
  username: string | null; 
  userId: string | null;
  profileSetupComplete: boolean;
  isLoading: boolean;
  
  displayName: string | null; // Actual name from profile (client or designer)
  
  // Client specific
  companyName: string | null; 

  // Designer specific
  designerHeadline: string | null;
  designerAvatarUrl: string | null;
  designerSkills: Tag[] | null;
  designerBio: string | null;
  designerPortfolioLinks: { title: string; url: string }[] | null;
  designerBudgetMin: number | null;
  designerBudgetMax: number | null;
  designerEmail: string | null;

  login: (type: 'user' | 'designer', username: string, id?: string) => void;
  logout: () => void;
  saveClientProfile: (profileData: UserProfileFormData) => void;
  saveDesignerProfile: (profileData: DesignerProfileFormData) => void;
}

export const useAuthMock = (): AuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [username, setUsername] = useState<string | null>(null); 
  const [userId, setUserId] = useState<string | null>(null);
  const [profileSetupComplete, setProfileSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [displayName, setDisplayName] = useState<string | null>(null);
  
  // Client specific
  const [companyName, setCompanyName] = useState<string | null>(null);

  // Designer specific
  const [designerHeadline, setDesignerHeadline] = useState<string | null>(null);
  const [designerAvatarUrl, setDesignerAvatarUrl] = useState<string | null>(null);
  const [designerSkills, setDesignerSkills] = useState<Tag[] | null>(null);
  const [designerBio, setDesignerBio] = useState<string | null>(null);
  const [designerPortfolioLinks, setDesignerPortfolioLinks] = useState<{ title: string; url: string }[] | null>(null);
  const [designerBudgetMin, setDesignerBudgetMin] = useState<number | null>(null);
  const [designerBudgetMax, setDesignerBudgetMax] = useState<number | null>(null);
  const [designerEmail, setDesignerEmail] = useState<string | null>(null);


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
        
        setDisplayName(storedAuth.displayName || storedAuth.username);

        if (storedAuth.userType === 'user' && storedAuth.profileSetupComplete) {
          setCompanyName(storedAuth.companyName || null);
        } else if (storedAuth.userType === 'designer' && storedAuth.profileSetupComplete) {
          setDesignerHeadline(storedAuth.designerHeadline || null);
          setDesignerAvatarUrl(storedAuth.designerAvatarUrl || null);
          setDesignerSkills(storedAuth.designerSkills || null);
          setDesignerBio(storedAuth.designerBio || null);
          setDesignerPortfolioLinks(storedAuth.designerPortfolioLinks || null);
          setDesignerBudgetMin(storedAuth.designerBudgetMin ?? null);
          setDesignerBudgetMax(storedAuth.designerBudgetMax ?? null);
          setDesignerEmail(storedAuth.designerEmail || null);
        }
      }
    } catch (error) {
      console.error("Failed to parse mockAuth from localStorage", error);
      localStorage.removeItem('mockAuth');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((type: 'user' | 'designer', loginUsername: string, id?: string) => {
    const newUserId = id || `mock-${type}-${loginUsername}-${Date.now()}`; // Ensure more unique ID
    
    let pscFromStorage = false;
    let finalDisplayName = loginUsername;
    let finalCompanyName: string | null = null;
    
    let finalDesignerHeadline: string | null = null;
    let finalDesignerAvatarUrl: string | null = null;
    let finalDesignerSkills: Tag[] | null = null;
    let finalDesignerBio: string | null = null;
    let finalDesignerPortfolioLinks: { title: string; url: string }[] | null = null;
    let finalDesignerBudgetMin: number | null = null;
    let finalDesignerBudgetMax: number | null = null;
    let finalDesignerEmail: string | null = null;

    try {
        const storedAuthString = localStorage.getItem('mockAuth');
        if (storedAuthString) {
            const stored: StoredAuthData = JSON.parse(storedAuthString);
            // Check if logging in as the same user that was previously stored
            if (stored.username === loginUsername && stored.userType === type) {
                pscFromStorage = stored.profileSetupComplete;
                finalDisplayName = stored.displayName || loginUsername;
                if (type === 'user') {
                   finalCompanyName = stored.companyName || null;
                } else if (type === 'designer') {
                   finalDesignerHeadline = stored.designerHeadline || null;
                   finalDesignerAvatarUrl = stored.designerAvatarUrl || null;
                   finalDesignerSkills = stored.designerSkills || null;
                   finalDesignerBio = stored.designerBio || null;
                   finalDesignerPortfolioLinks = stored.designerPortfolioLinks || null;
                   finalDesignerBudgetMin = stored.designerBudgetMin ?? null;
                   finalDesignerBudgetMax = stored.designerBudgetMax ?? null;
                   finalDesignerEmail = stored.designerEmail || null;
                }
            } else {
              // Logging in as a new user or different type, reset profile specific fields
              // pscFromStorage remains false
            }
        }
    } catch (e) { /* ignore parsing error, will use defaults */ }
    
    setIsAuthenticated(true);
    setUserType(type);
    setUsername(loginUsername);
    setUserId(newUserId);
    setProfileSetupComplete(pscFromStorage);
    setDisplayName(finalDisplayName);

    if (type === 'user') {
      setCompanyName(finalCompanyName);
      // Clear designer fields if switching
      setDesignerHeadline(null); setDesignerAvatarUrl(null); setDesignerSkills(null); setDesignerBio(null); setDesignerPortfolioLinks(null); setDesignerBudgetMin(null); setDesignerBudgetMax(null); setDesignerEmail(null);
    } else if (type === 'designer') {
      setDesignerHeadline(finalDesignerHeadline);
      setDesignerAvatarUrl(finalDesignerAvatarUrl);
      setDesignerSkills(finalDesignerSkills);
      setDesignerBio(finalDesignerBio);
      setDesignerPortfolioLinks(finalDesignerPortfolioLinks);
      setDesignerBudgetMin(finalDesignerBudgetMin);
      setDesignerBudgetMax(finalDesignerBudgetMax);
      setDesignerEmail(finalDesignerEmail);
      // Clear client fields if switching
      setCompanyName(null);
    }

    try {
      const dataToStore: StoredAuthData = {
        isAuthenticated: true,
        userType: type,
        username: loginUsername,
        userId: newUserId,
        profileSetupComplete: pscFromStorage,
        displayName: finalDisplayName,
        // Client specific
        companyName: type === 'user' ? finalCompanyName : undefined,
        // Designer specific (displayName already covers designer's name)
        designerHeadline: type === 'designer' ? finalDesignerHeadline : undefined,
        designerAvatarUrl: type === 'designer' ? finalDesignerAvatarUrl : undefined,
        designerSkills: type === 'designer' ? finalDesignerSkills : undefined,
        designerBio: type === 'designer' ? finalDesignerBio : undefined,
        designerPortfolioLinks: type === 'designer' ? finalDesignerPortfolioLinks : undefined,
        designerBudgetMin: type === 'designer' ? finalDesignerBudgetMin : undefined,
        designerBudgetMax: type === 'designer' ? finalDesignerBudgetMax : undefined,
        designerEmail: type === 'designer' ? finalDesignerEmail : undefined,
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
    setDesignerHeadline(null);
    setDesignerAvatarUrl(null);
    setDesignerSkills(null);
    setDesignerBio(null);
    setDesignerPortfolioLinks(null);
    setDesignerBudgetMin(null);
    setDesignerBudgetMax(null);
    setDesignerEmail(null);
    try {
      localStorage.removeItem('mockAuth');
    } catch (error) {
      console.error("Failed to remove mockAuth from localStorage", error);
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/'; 
    }
  }, []);

  const saveClientProfile = useCallback((profileData: UserProfileFormData) => {
    if (isAuthenticated && userType === 'user') {
      setDisplayName(profileData.name);
      setCompanyName(profileData.companyName || null);
      setProfileSetupComplete(true);
      try {
        const currentDataString = localStorage.getItem('mockAuth');
        const currentData: StoredAuthData = currentDataString ? JSON.parse(currentDataString) : {} as StoredAuthData;

        const dataToStore: StoredAuthData = {
          ...currentData,
          isAuthenticated: true,
          userType: 'user',
          username, 
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

  const saveDesignerProfile = useCallback((profileData: DesignerProfileFormData) => {
    if (isAuthenticated && userType === 'designer') {
      setDisplayName(profileData.name); // Designer's name is the displayName
      setDesignerHeadline(profileData.headline);
      setDesignerAvatarUrl(profileData.avatarUrl || null);
      setDesignerSkills(profileData.skills);
      setDesignerBio(profileData.bio);
      setDesignerPortfolioLinks(profileData.portfolioLinks || null);
      setDesignerBudgetMin(profileData.budgetMin);
      setDesignerBudgetMax(profileData.budgetMax);
      setDesignerEmail(profileData.email || null);
      setProfileSetupComplete(true);

      try {
        const currentDataString = localStorage.getItem('mockAuth');
        const currentData: StoredAuthData = currentDataString ? JSON.parse(currentDataString) : {} as StoredAuthData;

        const dataToStore: StoredAuthData = {
          ...currentData,
          isAuthenticated: true,
          userType: 'designer',
          username,
          userId,
          profileSetupComplete: true,
          displayName: profileData.name,
          // Designer specific fields
          designerHeadline: profileData.headline,
          designerAvatarUrl: profileData.avatarUrl || undefined,
          designerSkills: profileData.skills,
          designerBio: profileData.bio,
          designerPortfolioLinks: profileData.portfolioLinks || undefined,
          designerBudgetMin: profileData.budgetMin,
          designerBudgetMax: profileData.budgetMax,
          designerEmail: profileData.email || undefined,
        };
        localStorage.setItem('mockAuth', JSON.stringify(dataToStore));
      } catch (error) {
        console.error("Failed to save designer profile to localStorage", error);
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
    designerHeadline,
    designerAvatarUrl,
    designerSkills,
    designerBio,
    designerPortfolioLinks,
    designerBudgetMin,
    designerBudgetMax,
    designerEmail,
    login, 
    logout, 
    saveClientProfile,
    saveDesignerProfile,
  };
};

