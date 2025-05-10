// @ts-nocheck
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserProfileFormData, DesignerProfileFormData } from '@/lib/schemas';
import type { Tag } from '@/lib/types';

type UserType = 'user' | 'designer' | null;

// Define keys for localStorage
const PROFILES_STORAGE_KEY = 'mockUserProfiles';
const ACTIVE_USER_KEY_STORAGE_KEY = 'activeMockUserKey';

interface StoredAuthData {
  isAuthenticated: boolean; 
  userType: UserType;
  username: string | null; 
  userId: string | null;
  profileSetupComplete: boolean;

  displayName?: string; 

  companyName?: string; 

  designerHeadline?: string;
  designerAvatarUrl?: string;
  designerSkills?: Tag[];
  designerBio?: string;
  designerPortfolioLinks?: { title: string; url: string }[];
  designerBudgetMin?: number;
  designerBudgetMax?: number;
  designerEmail?: string; 
  designerPhone?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userType: UserType;
  username: string | null; 
  userId: string | null;
  profileSetupComplete: boolean;
  isLoading: boolean;
  
  displayName: string | null;
  
  companyName: string | null; 

  designerHeadline: string | null;
  designerAvatarUrl: string | null;
  designerSkills: Tag[] | null;
  designerBio: string | null;
  designerPortfolioLinks: { title: string; url: string }[] | null;
  designerBudgetMin: number | null;
  designerBudgetMax: number | null;
  designerEmail: string | null;
  designerPhone: string | null;

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
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [designerHeadline, setDesignerHeadline] = useState<string | null>(null);
  const [designerAvatarUrl, setDesignerAvatarUrl] = useState<string | null>(null);
  const [designerSkills, setDesignerSkills] = useState<Tag[] | null>(null);
  const [designerBio, setDesignerBio] = useState<string | null>(null);
  const [designerPortfolioLinks, setDesignerPortfolioLinks] = useState<{ title: string; url: string }[] | null>(null);
  const [designerBudgetMin, setDesignerBudgetMin] = useState<number | null>(null);
  const [designerBudgetMax, setDesignerBudgetMax] = useState<number | null>(null);
  const [designerEmail, setDesignerEmail] = useState<string | null>(null);
  const [designerPhone, setDesignerPhone] = useState<string | null>(null);


  const [allProfiles, setAllProfiles] = useState<Record<string, StoredAuthData>>({});

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedProfilesString = localStorage.getItem(PROFILES_STORAGE_KEY);
      const profiles: Record<string, StoredAuthData> = storedProfilesString ? JSON.parse(storedProfilesString) : {};
      setAllProfiles(profiles);

      const activeUserKey = localStorage.getItem(ACTIVE_USER_KEY_STORAGE_KEY);
      
      if (activeUserKey && profiles[activeUserKey]) {
        const activeUserProfile = profiles[activeUserKey];
        setIsAuthenticated(true);
        setUserType(activeUserProfile.userType);
        setUsername(activeUserProfile.username);
        setUserId(activeUserProfile.userId);
        setProfileSetupComplete(activeUserProfile.profileSetupComplete);
        setDisplayName(activeUserProfile.displayName || activeUserProfile.username);

        if (activeUserProfile.userType === 'user') {
          setCompanyName(activeUserProfile.companyName || null);
        } else if (activeUserProfile.userType === 'designer') {
          setDesignerHeadline(activeUserProfile.designerHeadline || null);
          setDesignerAvatarUrl(activeUserProfile.designerAvatarUrl || null);
          setDesignerSkills(activeUserProfile.designerSkills || null);
          setDesignerBio(activeUserProfile.designerBio || null);
          setDesignerPortfolioLinks(activeUserProfile.designerPortfolioLinks || null);
          setDesignerBudgetMin(activeUserProfile.designerBudgetMin ?? null);
          setDesignerBudgetMax(activeUserProfile.designerBudgetMax ?? null);
          setDesignerEmail(activeUserProfile.designerEmail || null);
          setDesignerPhone(activeUserProfile.designerPhone || null);
        }
      } else {
        // Reset to a logged-out state if no active user or profile mismatch
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
        setDesignerPhone(null);
      }
    } catch (error) {
      console.error("Failed to load auth state from localStorage", error);
      localStorage.removeItem(PROFILES_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_USER_KEY_STORAGE_KEY);
      // Reset to a logged-out state on error
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
      setDesignerPhone(null);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((type: 'user' | 'designer', loginUsername: string, id?: string) => {
    const userKey = `${loginUsername}_${type}`;
    const existingProfile = allProfiles[userKey];
    const effectiveUserId = id || existingProfile?.userId || `mock-${type}-${loginUsername}`;

    let psc = false;
    let dispName = loginUsername;
    let compName: string | null = null;
    let desHeadline: string | null = null;
    let desAvatar: string | null = null;
    let desSkills: Tag[] | null = null;
    let desBio: string | null = null;
    let desPortfolio: { title: string; url: string }[] | null = null;
    let desBudgetMin: number | null = null;
    let desBudgetMax: number | null = null;
    let desEmail: string | null = null;
    let desPhone: string | null = null;


    if (existingProfile) {
      psc = existingProfile.profileSetupComplete;
      dispName = existingProfile.displayName || loginUsername;
      if (type === 'user') {
        compName = existingProfile.companyName || null;
      } else if (type === 'designer') {
        desHeadline = existingProfile.designerHeadline || null;
        desAvatar = existingProfile.designerAvatarUrl || null;
        desSkills = existingProfile.designerSkills || null;
        desBio = existingProfile.designerBio || null;
        desPortfolio = existingProfile.designerPortfolioLinks || null;
        desBudgetMin = existingProfile.designerBudgetMin ?? null;
        desBudgetMax = existingProfile.designerBudgetMax ?? null;
        desEmail = existingProfile.designerEmail || null;
        desPhone = existingProfile.designerPhone || null;
      }
    }

    setIsAuthenticated(true);
    setUserType(type);
    setUsername(loginUsername);
    setUserId(effectiveUserId);
    setProfileSetupComplete(psc);
    setDisplayName(dispName);

    if (type === 'user') {
      setCompanyName(compName);
      setDesignerHeadline(null); setDesignerAvatarUrl(null); setDesignerSkills(null); setDesignerBio(null); setDesignerPortfolioLinks(null); setDesignerBudgetMin(null); setDesignerBudgetMax(null); setDesignerEmail(null); setDesignerPhone(null);
    } else if (type === 'designer') {
      setDesignerHeadline(desHeadline);
      setDesignerAvatarUrl(desAvatar);
      setDesignerSkills(desSkills);
      setDesignerBio(desBio);
      setDesignerPortfolioLinks(desPortfolio);
      setDesignerBudgetMin(desBudgetMin);
      setDesignerBudgetMax(desBudgetMax);
      setDesignerEmail(desEmail);
      setDesignerPhone(desPhone);
      setCompanyName(null);
    }

    try {
      const updatedProfileData: StoredAuthData = {
        ...(existingProfile || {}),
        isAuthenticated: true,
        userType: type,
        username: loginUsername,
        userId: effectiveUserId,
        profileSetupComplete: psc,
        displayName: dispName,
        companyName: type === 'user' ? compName : undefined,
        designerHeadline: type === 'designer' ? desHeadline : undefined,
        designerAvatarUrl: type === 'designer' ? desAvatar : undefined,
        designerSkills: type === 'designer' ? desSkills : undefined,
        designerBio: type === 'designer' ? desBio : undefined,
        designerPortfolioLinks: type === 'designer' ? desPortfolio : undefined,
        designerBudgetMin: type === 'designer' ? desBudgetMin : undefined,
        designerBudgetMax: type === 'designer' ? desBudgetMax : undefined,
        designerEmail: type === 'designer' ? desEmail : undefined,
        designerPhone: type === 'designer' ? desPhone : undefined,
      };
      const newAllProfiles = { ...allProfiles, [userKey]: updatedProfileData };
      setAllProfiles(newAllProfiles); 
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newAllProfiles));
      localStorage.setItem(ACTIVE_USER_KEY_STORAGE_KEY, userKey);
    } catch (error) {
      console.error("Failed to update localStorage during login", error);
    }
  }, [allProfiles]);

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
    setDesignerPhone(null);


    try {
      localStorage.removeItem(ACTIVE_USER_KEY_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear active user from localStorage", error);
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/'; 
    }
  }, []);

  const saveClientProfile = useCallback((profileData: UserProfileFormData) => {
    if (isAuthenticated && userType === 'user' && username && userId) {
      const userKey = `${username}_${userType}`;
      const updatedProfile: StoredAuthData = {
        ...(allProfiles[userKey] || {}),
        isAuthenticated: true,
        userType: 'user',
        username: username,
        userId: userId,
        profileSetupComplete: true,
        displayName: profileData.name,
        companyName: profileData.companyName || undefined,
        designerHeadline: undefined,
        designerAvatarUrl: undefined,
        designerSkills: undefined,
        designerBio: undefined,
        designerPortfolioLinks: undefined,
        designerBudgetMin: undefined,
        designerBudgetMax: undefined,
        designerEmail: undefined,
        designerPhone: undefined,
      };

      const newAllProfiles = { ...allProfiles, [userKey]: updatedProfile };
      setAllProfiles(newAllProfiles); 
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newAllProfiles));
      
      setDisplayName(profileData.name);
      setCompanyName(profileData.companyName || null);
      setProfileSetupComplete(true);
    }
  }, [isAuthenticated, userType, username, userId, allProfiles]);

  const saveDesignerProfile = useCallback((profileData: DesignerProfileFormData) => {
    if (isAuthenticated && userType === 'designer' && username && userId ) {
        const userKey = `${username}_${userType}`;
        const updatedProfile: StoredAuthData = {
            ...(allProfiles[userKey] || {}),
            isAuthenticated: true,
            userType: 'designer',
            username: username,
            userId: userId,
            profileSetupComplete: true,
            displayName: profileData.name,
            companyName: undefined,
            designerHeadline: profileData.headline,
            designerAvatarUrl: profileData.avatarUrl || undefined,
            designerSkills: profileData.skills,
            designerBio: profileData.bio,
            designerPortfolioLinks: profileData.portfolioLinks || undefined,
            designerBudgetMin: profileData.budgetMin,
            designerBudgetMax: profileData.budgetMax,
            designerEmail: profileData.email || undefined,
            designerPhone: profileData.phone || undefined,
        };
        const newAllProfiles = { ...allProfiles, [userKey]: updatedProfile };
        setAllProfiles(newAllProfiles); 
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newAllProfiles));

        setDisplayName(profileData.name);
        setDesignerHeadline(profileData.headline);
        setDesignerAvatarUrl(profileData.avatarUrl || null);
        setDesignerSkills(profileData.skills);
        setDesignerBio(profileData.bio);
        setDesignerPortfolioLinks(profileData.portfolioLinks || null);
        setDesignerBudgetMin(profileData.budgetMin);
        setDesignerBudgetMax(profileData.budgetMax);
        setDesignerEmail(profileData.email || null);
        setDesignerPhone(profileData.phone || null);
        setProfileSetupComplete(true);
    }
  }, [isAuthenticated, userType, username, userId, allProfiles]);


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
    designerPhone,
    login, 
    logout, 
    saveClientProfile,
    saveDesignerProfile,
  };
};
