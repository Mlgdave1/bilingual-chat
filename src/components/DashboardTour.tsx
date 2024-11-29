import React from 'react';
import Joyride, { Step } from 'react-joyride';

interface DashboardTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardTour({ isOpen, onClose }: DashboardTourProps) {
  const steps: Step[] = [
    {
      target: 'body',
      content: 'Welcome to BilingualChat! Let\'s take a quick tour of your dashboard.',
      placement: 'center',
    },
    {
      target: '.quick-translate-button',
      content: 'Use Quick Translate for instant voice translations when talking to someone in person.',
      placement: 'bottom',
    },
    {
      target: '.learning-stats',
      content: 'Track your language learning progress and achievements here.',
      placement: 'left',
    },
    {
      target: '.new-chat-button',
      content: 'Create new private chat rooms for your conversations.',
      placement: 'bottom',
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={isOpen}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: '#3b82f6',
          backgroundColor: '#2a2b38',
          textColor: '#fff',
        },
      }}
      callback={({ status }) => {
        if (['finished', 'skipped'].includes(status)) {
          onClose();
        }
      }}
    />
  );
}