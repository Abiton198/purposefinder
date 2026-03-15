import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { SchoolProvider } from '@/contexts/SchoolContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <SchoolProvider>
        <AppLayout />
      </SchoolProvider>
    </AppProvider>
  );
};

export default Index;
