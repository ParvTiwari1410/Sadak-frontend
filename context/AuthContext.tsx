import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  name: string;
  email: string;
  role: 'citizen' | 'authority';
};

type AuthContextType = {
  user: User | null;
  signIn: (userData: User) => void;
  signOut: () => void;
  hasSeenOnboarding: boolean;
  setOnboardingComplete: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const onboardingStatus = await AsyncStorage.getItem('hasSeenOnboarding');
        setHasSeenOnboarding(onboardingStatus === 'true');
        // You can also add logic here to check for a stored user token
      } catch (e) {
        console.error("Failed to load session data", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  const signIn = (userData: User) => {
    // This function's only job is to update the state.
    setUser(userData);
  };

  const signOut = () => {
    // This function's only job is to clear the state.
    setUser(null);
  };
  
  const setOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setHasSeenOnboarding(true);
    } catch (e) {
      console.error("Failed to save onboarding status", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, hasSeenOnboarding, setOnboardingComplete, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};