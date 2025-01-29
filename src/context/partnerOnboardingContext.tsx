'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of your context
interface PartnerOnboardingContextType {
  partner: {
    email: string;
    name: string;
    isVerified: boolean;
    contactNo: string;
    brandName: string;
    industry: string;
    category: string;
    ageGroups: string[];
    logo: string;
    websiteLinks: string[];
    outlet: {
      name: string;
      address: string;
      contactNo1: string;
      contactNo2: string;
      openingTime: string;
      closingTime: string;
      images: File[];
      daysOpen: string[];
      methodsOfPayment: string[];
      customerCapacity: string;
      latitude: number | null;
      longitude: number | null;
    }[];
    products: {
      name: string;
      productId: string;
      category: string;
      quantity: number;
      price: number;
    }[];
  }[];
  setPartner: React.Dispatch<React.SetStateAction<{
    email: string;
    name: string;
    isVerified: boolean;
    contactNo: string;
    brandName: string;
    industry: string;
    category: string;
    ageGroups: string[];
    logo: string;
    websiteLinks: string[];
    outlet: {
      name: string;
      address: string;
      contactNo1: string;
      contactNo2: string;
      openingTime: string;
      closingTime: string;
      images: File[];
      daysOpen: string[];
      methodsOfPayment: string[];
      customerCapacity: string;
      latitude: number | null;
      longitude: number | null;
    }[];
    products: {
      name: string;
      productId: string;
      category: string;
      quantity: number;
      price: number;
    }[];
  }[]>>;
}

// Create the context with a default value
const PartnerOnboardingContext = createContext<PartnerOnboardingContextType | undefined>(undefined);

// Create a provider component
export const PartnerOnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [partner, setPartner] = useState<{
    email: string;
    name: string;
    isVerified: boolean;
    contactNo: string;
    brandName: string;
    industry: string;
    category: string;
    ageGroups: string[];
    logo: string;
    websiteLinks: string[];
    outlet: {
      name: string;
      address: string;
      contactNo1: string;
      contactNo2: string;
      openingTime: string;
      closingTime: string;
      images: File[];
      daysOpen: string[];
      methodsOfPayment: string[];
      customerCapacity: string;
      latitude: number | null;
      longitude: number | null;
    }[];
    products: {
      name: string;
      productId: string;
      category: string;
      quantity: number;
      price: number;
    }[];
  }[]>([]);


  console.log("partner>>", partner);

  return (
    <PartnerOnboardingContext.Provider value={{ partner, setPartner }}>
      {children}
    </PartnerOnboardingContext.Provider>
  );
};

// Custom hook to use the PartnerOnboardingContext
export const usePartnerOnboarding = () => {
  const context = useContext(PartnerOnboardingContext);
  if (context === undefined) {
    throw new Error('usePartnerOnboarding must be used within a PartnerOnboardingProvider');
  }
  return context;
};