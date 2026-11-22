import React from 'react';
import { Outlet } from 'react-router-dom';
import { ConsumerNavbar } from './ConsumerNavbar';
import { PublicFooter } from './PublicFooter';

export const ConsumerLayout = () => {
  return (
    <div className="min-h-screen bg-page flex flex-col font-sans">
      <ConsumerNavbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
