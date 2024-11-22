'use client';

import React from 'react';

interface ButtonProps {
  variant?: 'outline' | string;
  size?: 'icon' | string;
  children: React.ReactNode;
  className?: string;
}

export const Button = ({ variant, size, children, className }: ButtonProps) => (
  <button
    className={`${
      variant === 'outline' ? 'border border-gray-200 hover:bg-gray-50' : ''
    } ${
      size === 'icon' ? 'p-2 rounded-lg' : ''
    } ${className || ''}`}
  >
    {children}
  </button>
);