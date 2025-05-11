
// @ts-nocheck
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { UserProfileFormData, DesignerProfileFormData } from '@/lib/schemas';
import type { Tag } from '@/lib/types';

type UserType = 'user' | 'designer' | null;

// Define keys for localStorage
const PROFILES_STORAGE_KEY = 'mockUserProfiles';
const ACTIVE_USER_KEY_STORAGE_KEY = 'activeMockUserKey';

export interface StoredAuthData {
  isAuthenticated: boolean; 
  userType: UserType;
  email: string | null; 
  userId: string | null;
  profileSetupComplete: boolean;
  displayName: string | null; 
  joinedDate?: string; 

  companyName?: string; 
  userAvatarUrl?: string;

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

export interface AuthState extends StoredAuthData {
  isLoading: boolean;
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
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null); 
  const [joinedDate, setJoinedDate] = useState<string | undefined>(undefined);

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

  const resetState = () => {
    setIsAuthenticated(false);
    setUserType(null);
    setEmail(null);
    setUserId(null);
    setProfileSetupComplete(false);
    setDisplayName(null);
    setJoinedDate(undefined);
    setCompanyName(null);
    setUserAvatarUrl(null);
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
  };

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
        setJoinedDate(activeUserProfile.joinedDate);

        if (activeUserProfile.userType === 'user') {
          setCompanyName(activeUserProfile.companyName || null);
          setUserAvatarUrl(activeUserProfile.userAvatarUrl || null);
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
          setDesignerTokens(activeUserProfile.designerTokens ?? 200); // Ensure default to 200
        }
      } else {
        resetState();
      }
    } catch (error) {
      console.error("Failed to load auth state from localStorage", error);
      localStorage.removeItem(PROFILES_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_USER_KEY_STORAGE_KEY);
      resetState();
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((type: 'user' | 'designer', loginEmail: string, displayNameForSignup?: string, id?: string) => {
    const userKey = `${loginEmail}_${type}`; 
    const existingProfile = allProfiles[userKey];
    const effectiveUserId = id || existingProfile?.userId || `mock-${type}-${Date.now()}`; 
    const currentJoinedDate = existingProfile?.joinedDate || new Date().toISOString();

    let psc = false;
    let dispName = displayNameForSignup || (existingProfile?.displayName || loginEmail.split('@')[0]); 
    
    let currentData: Partial<StoredAuthData> = {};
    
    if (existingProfile) {
      psc = existingProfile.profileSetupComplete;
      currentData = existingProfile;
    } else {
      // New user signup: ensure designer tokens are set to 200 if it's a new designer
      currentData.designerTokens = type === 'designer' ? 200 : undefined;
    }

    const newProfileData: StoredAuthData = {
      isAuthenticated: true,
      userType: type,
      email: loginEmail,
      userId: effectiveUserId,
      profileSetupComplete: psc,
      displayName: dispName,
      joinedDate: currentJoinedDate,
      
      // User specific
      companyName: type === 'user' ? (currentData.companyName || undefined) : undefined,
      userAvatarUrl: type === 'user' ? (currentData.userAvatarUrl || `https://i.pravatar.cc/150?u=${loginEmail}`) : undefined,

      // Designer specific
      designerHeadline: type === 'designer' ? (currentData.designerHeadline || undefined) : undefined,
      designerAvatarUrl: type === 'designer' ? (currentData.designerAvatarUrl || `https://i.pravatar.cc/150?u=${loginEmail}`) : undefined,
      designerSkills: type === 'designer' ? (currentData.designerSkills || []) : undefined,
      designerBio: type === 'designer' ? (currentData.designerBio || undefined) : undefined,
      designerPortfolioLinks: type === 'designer' ? (currentData.designerPortfolioLinks || [{title: "", url:""}]) : undefined,
      designerBudgetMin: type === 'designer' ? (currentData.designerBudgetMin ?? 0) : undefined,
      designerBudgetMax: type === 'designer' ? (currentData.designerBudgetMax ?? 0) : undefined,
      designerEmail: type === 'designer' ? (currentData.designerEmail || loginEmail) : loginEmail, // Ensure designerEmail is set
      designerPhone: type === 'designer' ? (currentData.designerPhone || '') : '', // Ensure designerPhone is set
      designerCity: type === 'designer' ? (currentData.designerCity || undefined) : undefined,
      designerPostalCode: type === 'designer' ? (currentData.designerPostalCode || undefined) : undefined,
      designerTokens: type === 'designer' ? (existingProfile ? (existingProfile.designerTokens ?? 200) : 200) : undefined, // Default to 200
    };
    
    // Update state
    setIsAuthenticated(true);
    setUserType(type);
    setEmail(loginEmail);
    setUserId(effectiveUserId);
    setProfileSetupComplete(psc);
    setDisplayName(dispName);
    setJoinedDate(currentJoinedDate);

    if (type === 'user') {
      setCompanyName(newProfileData.companyName || null);
      setUserAvatarUrl(newProfileData.userAvatarUrl || null);
      // Clear designer specific fields from state
      setDesignerHeadline(null); setDesignerAvatarUrl(null); setDesignerSkills(null); setDesignerBio(null); setDesignerPortfolioLinks(null); setDesignerBudgetMin(null); setDesignerBudgetMax(null); setDesignerContactEmail(null); setDesignerPhone(null); setDesignerCity(null); setDesignerPostalCode(null); setDesignerTokens(null);
    } else { // type === 'designer'
      setDesignerHeadline(newProfileData.designerHeadline || null);
      setDesignerAvatarUrl(newProfileData.designerAvatarUrl || null);
      setDesignerSkills(newProfileData.designerSkills || null);
      setDesignerBio(newProfileData.designerBio || null);
      setDesignerPortfolioLinks(newProfileData.designerPortfolioLinks || null);
      setDesignerBudgetMin(newProfileData.designerBudgetMin ?? null);
      setDesignerBudgetMax(newProfileData.designerBudgetMax ?? null);
      setDesignerContactEmail(newProfileData.designerEmail);
      setDesignerPhone(newProfileData.designerPhone);
      setDesignerCity(newProfileData.designerCity || null);
      setDesignerPostalCode(newProfileData.designerPostalCode || null);
      setDesignerTokens(newProfileData.designerTokens ?? 200); // Ensure state is updated with 200
      // Clear user specific fields from state
      setCompanyName(null); setUserAvatarUrl(null);
    }


    try {
      const newAllProfiles = { ...allProfiles, [userKey]: newProfileData };
      setAllProfiles(newAllProfiles); 
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newAllProfiles));
      localStorage.setItem(ACTIVE_USER_KEY_STORAGE_KEY, userKey);
    } catch (error) {
      console.error("Failed to update localStorage during login", error);
    }
  }, [allProfiles]);

  const logout = useCallback(() => {
    resetState();
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
    if (isAuthenticated && userType === 'user' && email && userId && joinedDate) { 
      const userKey = `${email}_${userType}`; 
      const avatar = userAvatarUrl || `https://i.pravatar.cc/150?u=${email}`;
      const updatedProfile: StoredAuthData = {
        ...(allProfiles[userKey] || {}), // Preserve other fields like tokens if any
        isAuthenticated: true,
        userType: 'user',
        email: email, 
        userId: userId,
        profileSetupComplete: true,
        displayName: profileData.name, 
        joinedDate: joinedDate,
        companyName: profileData.companyName || undefined,
        userAvatarUrl: avatar,
        // Explicitly undefined designer fields
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
      setUserAvatarUrl(avatar);
      setProfileSetupComplete(true);
    }
  }, [isAuthenticated, userType, email, userId, allProfiles, joinedDate, userAvatarUrl]);

  const saveDesignerProfile = useCallback((profileData: DesignerProfileFormData) => {
    if (isAuthenticated && userType === 'designer' && email && userId && joinedDate ) { 
        const userKey = `${email}_${userType}`; 
        const currentTokens = designerTokens ?? allProfiles[userKey]?.designerTokens ?? 200; // Default to 200
        const avatar = profileData.avatarUrl || designerAvatarUrl || `https://i.pravatar.cc/150?u=${email}`;

        const updatedProfile: StoredAuthData = {
            ...(allProfiles[userKey] || {}),
            isAuthenticated: true,
            userType: 'designer',
            email: email, 
            userId: userId,
            profileSetupComplete: true,
            displayName: profileData.name,
            joinedDate: joinedDate,
            
            companyName: undefined, 
            userAvatarUrl: undefined,

            designerHeadline: profileData.headline,
            designerAvatarUrl: avatar,
            designerSkills: profileData.skills,
            designerBio: profileData.bio,
            designerPortfolioLinks: profileData.portfolioLinks && profileData.portfolioLinks.length > 0 && profileData.portfolioLinks.some(l => l.title || l.url) ? profileData.portfolioLinks : [],
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
        setDesignerAvatarUrl(avatar);
        setDesignerSkills(profileData.skills);
        setDesignerBio(profileData.bio);
        setDesignerPortfolioLinks(profileData.portfolioLinks && profileData.portfolioLinks.length > 0 && profileData.portfolioLinks.some(l => l.title || l.url) ? profileData.portfolioLinks : []);
        setDesignerBudgetMin(profileData.budgetMin);
        setDesignerBudgetMax(profileData.budgetMax);
        setDesignerContactEmail(profileData.email); 
        setDesignerPhone(profileData.phone);
        setDesignerCity(profileData.city);
        setDesignerPostalCode(profileData.postalCode);
        setDesignerTokens(currentTokens); 
        setProfileSetupComplete(true);
    }
  }, [isAuthenticated, userType, email, userId, allProfiles, designerTokens, joinedDate, designerAvatarUrl]);

  const updateDesignerTokens = useCallback((count: number) => {
    if (isAuthenticated && userType === 'designer' && email && userId) {
      const newTotalTokens = (designerTokens ?? 0) + count; // Ensure designerTokens is not null
      setDesignerTokens(newTotalTokens);

      const userKey = `${email}_${userType}`;
      const currentProfile = allProfiles[userKey]; // Should always exist if authenticated
      if (currentProfile) {
        const updatedProfile = {
          ...currentProfile,
          designerTokens: newTotalTokens,
        };
        const newAllProfiles = { ...allProfiles, [userKey]: updatedProfile as StoredAuthData };
        setAllProfiles(newAllProfiles);
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newAllProfiles));
      }
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
    joinedDate,
    companyName,
    userAvatarUrl,
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

