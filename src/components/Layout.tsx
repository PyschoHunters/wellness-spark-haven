
import React from 'react';
import Navigation from './Navigation';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 mb-16">
          {children}
        </main>
        <Navigation />
      </div>
    </div>
  );
};
