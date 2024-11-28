import React from 'react';
import Image from 'next/image';
import { TaskCardProps } from '@/app/interfaces/types';

const TaskCard = ({ task, projectColors, onModify, onDelete }: TaskCardProps) => {
  const { bg, text } = projectColors;

  return (
    <div className={`relative p-2 rounded-md w-full ${bg} ${text}`}>
      <div className="font-medium">{task.projectName}</div>
      <div className="text-sm">{task.taskName}</div>
      <div className="text-xs mt-1">{task.hours} hs</div>
      <div className="absolute bottom-2 w-full flex justify-between px-2">
        <div className="flex-1"></div>
        <button
          onClick={() => onModify(task)}
          className="mx-auto"
        >
          <Image src="/lapicito.svg" alt="modify" width={20} height={20} />
        </button>
        <button onClick={() => onDelete(task.id)}>
          <Image src="/delete.svg" alt="delete" width={20} height={20} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;