import React from 'react';
import Image from 'next/image';
import { TaskCardProps } from '@/app/interfaces/types';

const TaskCard = ({ task, projectColors, onModify, onDelete }: TaskCardProps) => {
  const { bg, text } = projectColors;

  const baseHeight = 108;
  const heightPerHour = 8;
  const dynamicHeight = Math.max(baseHeight, baseHeight + (task.hours * heightPerHour));

  const getHourSize = (hours: number) => {
    if (hours >= 8) return 'text-lg';
    if (hours >= 5) return 'text-base';
    if (hours >= 3) return 'text-sm';
    return 'text-xs';
  };

  return (
    <div
      className={`relative p-3 rounded-md w-full ${bg} ${text} overflow-hidden`}
      style={{
        height: `${dynamicHeight}px`,
        transition: 'height 0.2s ease-in-out'
      }}
    >
      <div className="flex flex-col h-full">
        <div
          className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400
            scrollbar-track-gray-200 scrollbar-thumb-rounded-full"
        >
          <div className="font-medium mb-0.5">
            {task.projectName}
          </div>

          <div className="text-sm mb-0.5">
            {task.taskName}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 mt-auto bg-inherit">
          <div className={`font-bold ${getHourSize(task.hours)}`}>
            {task.hours} hs
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onModify(task)}
              className="p-1"
            >
              <Image src="/lapicito.svg" alt="modify" width={18} height={18} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1"
            >
              <Image src="/delete.svg" alt="delete" width={18} height={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;