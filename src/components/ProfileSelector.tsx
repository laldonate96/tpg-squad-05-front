'use client';
import React from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';

interface ProfileSelectorProps {
  resources: Array<{ id: string; nombre: string; apellido: string }>;
  selectedId: string;
  onChange: (id: string) => void;
}

const ProfileSelector = ({ resources, selectedId, onChange }: ProfileSelectorProps) => {
  const currentIndex = resources.findIndex(r => r.id === selectedId);

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + resources.length) % resources.length;
    onChange(resources[newIndex].id);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % resources.length;
    onChange(resources[newIndex].id);
  };

  const currentResource = resources[currentIndex];

  return (
    <div className="absolute top-4 left-4 flex items-center gap-4 justify-start mb-4">
      <div className="flex items-center bg-white rounded-lg p-2 gap-4">
        <button onClick={handlePrevious} className="hover:bg-gray-100 p-1 rounded">
          <ChevronLeft size={20} color="black" />
        </button>

        <div className="flex items-center gap-2 min-w-[200px] justify-center">
          <User size={24} className="text-gray-600" />
          <span className="text-gray-800">
            {currentResource?.nombre} {currentResource?.apellido}
          </span>
        </div>

        <button onClick={handleNext} className="hover:bg-gray-100 p-1 rounded">
          <ChevronRight size={20} color="black" />
        </button>
      </div>
    </div>
  );
};

export default ProfileSelector;
