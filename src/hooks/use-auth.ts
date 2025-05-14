import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup = async (email: string, password: string, displayName: string, userType: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });
    await sendEmailVerification(user);

    await setDoc(doc(db, "users", user.uid), {
      email,
      displayName,
      userType,
      emailVerified: false,
      createdAt: new Date().toISOString(),
    });

    setUser(user);
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userDocRef);

    if (user.emailVerified) {
      await updateDoc(userDocRef, { emailVerified: true });
    }

    setUser(user);
  };

  const logout = () => signOut(auth);

  return {
    user,
    loading,
    login,
    signup,
    logout,
  };
}
