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
  email: string | null; 
  userId: string | null;
  profileSetupComplete: boolean;
  displayName: string | null; 

  companyName?: string; 

  designerHeadline?: string;
  designerAvatarUrl?: string;
  designerSkills?: Tag[];
  designerBio?: string;
  designerPortfolioLinks?: { title: string; url: string }[];
  designerBudgetMin?: number;
  designerBudgetMax?: number;
  designerEmail: string; 
  designerPhone: string;
  designerCity?: string;
  designerPostalCode?: string;
  designerTokens?: number; 
}

export interface AuthState {
  isAuthenticated: boolean;
  userType: UserType;
  email: string | null; 
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
  designerCity: string | null;
  designerPostalCode: string | null;
  designerTokens: number | null; 

  login: (type: 'user' | 'designer', email: string, displayNameForSignup?: string, id?: string) => void;
  logout: () => void;
  saveClientProfile: (profileData: UserProfileFormData) => void;
  saveDesignerProfile: (profileData: DesignerProfileFormData) => void;
  updateDesignerTokens: (count: number) => void; 
}

export const useAuthMock = (): AuthState => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [email, setEmail] = useState<string | null>(null); 
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
  const [designerContactEmail, setDesignerContactEmail] = useState<string | null>(null); 
  const [designerPhone, setDesignerPhone] = useState<string | null>(null);
  const [designerCity, setDesignerCity] = useState<string | null>(null);
  const [designerPostalCode, setDesignerPostalCode] = useState<string | null>(null);
  const [designerTokens, setDesignerTokens] = useState<number | null>(null); 


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
        setEmail(activeUserProfile.email); 
        setUserId(activeUserProfile.userId);
        setProfileSetupComplete(activeUserProfile.profileSetupComplete);
        setDisplayName(activeUserProfile.displayName); 

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
          setDesignerContactEmail(activeUserProfile.designerEmail); 
          setDesignerPhone(activeUserProfile.designerPhone);
          setDesignerCity(activeUserProfile.designerCity || null);
          setDesignerPostalCode(activeUserProfile.designerPostalCode || null);
          setDesignerTokens(activeUserProfile.designerTokens ?? 25); 
        }
      } else {
        // Reset to a logged-out state
        setIsAuthenticated(false);
        setUserType(null);
        setEmail(null);
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
        setDesignerContactEmail(null);
        setDesignerPhone(null);
        setDesignerCity(null);
        setDesignerPostalCode(null);
        setDesignerTokens(null); 
      }
    } catch (error) {
      console.error("Failed to load auth state from localStorage", error);
      localStorage.removeItem(PROFILES_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_USER_KEY_STORAGE_KEY);
      // Reset to a logged-out state on error
        setIsAuthenticated(false);
        setUserType(null);
        setEmail(null);
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
        setDesignerContactEmail(null);
        setDesignerPhone(null);
        setDesignerCity(null);
        setDesignerPostalCode(null);
        setDesignerTokens(null); 
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((type: 'user' | 'designer', loginEmail: string, displayNameForSignup?: string, id?: string) => {
    const userKey = `${loginEmail}_${type}`; 
    const existingProfile = allProfiles[userKey];
    const effectiveUserId = id || existingProfile?.userId || `mock-${type}-${loginEmail.split('@')[0]}`; 

    let psc = false;
    let dispName = displayNameForSignup || loginEmail.split('@')[0]; 
    let compName: string | null = null;
    let desHeadline: string | null = null;
    let desAvatar: string | null = null;
    let desSkills: Tag[] | null = null;
    let desBio: string | null = null;
    let desPortfolio: { title: string; url: string }[] | null = null;
    let desBudgetMin: number | null = null;
    let desBudgetMax: number | null = null;
    let desContactEmail: string | null = null;
    let desPhone: string | null = null;
    let desCity: string | null = null;
    let desPostalCode: string | null = null;
    let desTokens: number | null = type === 'designer' ? 25 : null; 


    if (existingProfile) {
      psc = existingProfile.profileSetupComplete;
      dispName = existingProfile.displayName || dispName; 
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
        desContactEmail = existingProfile.designerEmail;
        desPhone = existingProfile.designerPhone;
        desCity = existingProfile.designerCity || null;
        desPostalCode = existingProfile.designerPostalCode || null;
        desTokens = existingProfile.designerTokens ?? 25; 
      }
    }

    setIsAuthenticated(true);
    setUserType(type);
    setEmail(loginEmail); 
    setUserId(effectiveUserId);
    setProfileSetupComplete(psc);
    setDisplayName(dispName); 

    if (type === 'user') {
      setCompanyName(compName);
      setDesignerHeadline(null); setDesignerAvatarUrl(null); setDesignerSkills(null); setDesignerBio(null); setDesignerPortfolioLinks(null); setDesignerBudgetMin(null); setDesignerBudgetMax(null); setDesignerContactEmail(null); setDesignerPhone(null); setDesignerCity(null); setDesignerPostalCode(null); setDesignerTokens(null);
    } else if (type === 'designer') {
      setDesignerHeadline(desHeadline);
      setDesignerAvatarUrl(desAvatar);
      setDesignerSkills(desSkills);
      setDesignerBio(desBio);
      setDesignerPortfolioLinks(desPortfolio);
      setDesignerBudgetMin(desBudgetMin);
      setDesignerBudgetMax(desBudgetMax);
      setDesignerContactEmail(desContactEmail);
      setDesignerPhone(desPhone);
      setDesignerCity(desCity);
      setDesignerPostalCode(desPostalCode);
      setDesignerTokens(desTokens); 
      setCompanyName(null);
    }

    try {
      const updatedProfileData: StoredAuthData = {
        ...(existingProfile || {}),
        isAuthenticated: true,
        userType: type,
        email: loginEmail, 
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
        designerEmail: type === 'designer' ? desContactEmail : (existingProfile?.designerEmail || loginEmail), // ensure designerEmail is set
        designerPhone: type === 'designer' ? desPhone : (existingProfile?.designerPhone || ''), // ensure designerPhone is set
        designerCity: type === 'designer' ? desCity : undefined,
        designerPostalCode: type === 'designer' ? desPostalCode : undefined,
        designerTokens: type === 'designer' ? desTokens : undefined, 
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
    setEmail(null);
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
    setDesignerContactEmail(null);
    setDesignerPhone(null);
    setDesignerCity(null);
    setDesignerPostalCode(null);
    setDesignerTokens(null); 


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
    if (isAuthenticated && userType === 'user' && email && userId) { 
      const userKey = `${email}_${userType}`; 
      const updatedProfile: StoredAuthData = {
        ...(allProfiles[userKey] || {}),
        isAuthenticated: true,
        userType: 'user',
        email: email, 
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
        designerEmail: email, 
        designerPhone: '',
        designerCity: undefined,
        designerPostalCode: undefined,
        designerTokens: undefined,
      };

      const newAllProfiles = { ...allProfiles, [userKey]: updatedProfile };
      setAllProfiles(newAllProfiles); 
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newAllProfiles));
      
      setDisplayName(profileData.name); 
      setCompanyName(profileData.companyName || null);
      setProfileSetupComplete(true);
    }
  }, [isAuthenticated, userType, email, userId, allProfiles]);

  const saveDesignerProfile = useCallback((profileData: DesignerProfileFormData) => {
    if (isAuthenticated && userType === 'designer' && email && userId ) { 
        const userKey = `${email}_${userType}`; 
        const currentTokens = designerTokens ?? allProfiles[userKey]?.designerTokens ?? 25;

        const updatedProfile: StoredAuthData = {
            ...(allProfiles[userKey] || {}),
            isAuthenticated: true,
            userType: 'designer',
            email: email, 
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
            designerEmail: profileData.email, 
            designerPhone: profileData.phone,
            designerCity: profileData.city,
            designerPostalCode: profileData.postalCode,
            designerTokens: currentTokens, 
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
        setDesignerContactEmail(profileData.email); 
        setDesignerPhone(profileData.phone);
        setDesignerCity(profileData.city);
        setDesignerPostalCode(profileData.postalCode);
        setDesignerTokens(currentTokens); 
        setProfileSetupComplete(true);
    }
  }, [isAuthenticated, userType, email, userId, allProfiles, designerTokens]);

  const updateDesignerTokens = useCallback((count: number) => {
    if (isAuthenticated && userType === 'designer' && email && userId) {
      const newTotalTokens = (designerTokens ?? 0) + count;
      setDesignerTokens(newTotalTokens);

      const userKey = `${email}_${userType}`;
      const currentProfile = allProfiles[userKey] || {};
      const updatedProfile = {
        ...currentProfile,
        designerTokens: newTotalTokens,
      };
      const newAllProfiles = { ...allProfiles, [userKey]: updatedProfile as StoredAuthData };
      setAllProfiles(newAllProfiles);
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newAllProfiles));
    }
  }, [isAuthenticated, userType, email, userId, designerTokens, allProfiles]);


  return { 
    isAuthenticated, 
    userType, 
    email, 
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
    designerEmail: designerContactEmail, 
    designerPhone,
    designerCity,
    designerPostalCode,
    designerTokens, 
    login, 
    logout, 
    saveClientProfile,
    saveDesignerProfile,
    updateDesignerTokens, 
  };
};
