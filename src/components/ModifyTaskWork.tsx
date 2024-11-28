'use client';

import React, { useState } from 'react';

interface ModifyTaskPopupProps {
  isOpen: boolean;
  onClose: () => void;
  taskName: string;
  initialHours: number;
  onSubmit: (newHours: number) => void;
}

const ModifyTaskPopup: React.FC<ModifyTaskPopupProps> = ({
  isOpen,
  onClose,
  taskName,
  initialHours,
  onSubmit,
}) => {
  const [newHours, setNewHours] = useState(initialHours);

  const handleSubmit = () => {
    onSubmit(newHours);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        <h2 className="text-xl font-bold text-black mb-4">Modify Task</h2>
        <p className="text-gray-700 mb-4">Task: {taskName}</p>
        <label htmlFor="hours" className="block text-gray-800 mb-2">
          Enter new number of hours:
        </label>
        <input
          id="hours"
          type="number"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newHours}
          onChange={(e) => setNewHours(Number(e.target.value))}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-md"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={handleSubmit}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyTaskPopup;
