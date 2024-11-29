import React from 'react';
import { Header } from './Header';
import { LearningReminder } from './LearningReminder';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const user = useAuthStore(state => state.user);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {user && <LearningReminder userId={user.id} />}
    </div>
  );
}