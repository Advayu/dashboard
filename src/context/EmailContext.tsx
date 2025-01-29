// src/context/EmailContext.tsx
'use client';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of your context
interface EmailContextType {
  email: string | null;
  setEmail: (email: string | null) => void;
}

// Create the context with a default value
const EmailContext = createContext<EmailContextType | undefined>(undefined);

// Create a provider component
export const EmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  );
};

// Custom hook to use the EmailContext
export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};
