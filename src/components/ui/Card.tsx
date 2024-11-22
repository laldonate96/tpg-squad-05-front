'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={`bg-white rounded-lg border border-gray-200 ${className || ''}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className }: CardContentProps) => (
  <div className={`p-4 ${className || ''}`}>
    {children}
  </div>
);