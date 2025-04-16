
import React from 'react';
import Navigation from './Navigation';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background pb-16">
      {children}
      <Navigation />
    </div>
  );
};
