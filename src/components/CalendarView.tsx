'use client';

import React, { useEffect, useState } from 'react';

interface Task {
id: number;
taskName: string;
projectName: string;
createdAt: string;
hours: number;
}

const CalendarView = () => {
const [tasks, setTasks] = useState<Task[]>([]);

useEffect(() => {
  fetch('https://squad05-2024-2c.onrender.com/task-work')
    .then(res => res.json())
    .then(data => setTasks(data));
}, []);

const days = Array(7).fill(null).map((_, index) => {
 const date = new Date('2024-11-20');
 date.setDate(date.getDate() + index);
 const tasksForDay = tasks.filter(task => {
   const taskDate = new Date(task.createdAt);
   return taskDate.getDate() === date.getDate() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getFullYear() === date.getFullYear();
 });

 return {
   date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
   day: date.toLocaleDateString('es-ES', { weekday: 'long' }),
   tasks: tasksForDay
 };
});

return (
  <div className="w-full max-w-6xl mx-auto p-4">
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button className="border border-gray-200 hover:bg-gray-50 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button className="border border-gray-200 hover:bg-gray-50 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
          <div className="text-lg font-semibold">{new Date().toLocaleDateString()}</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div key={index} className="border rounded-lg p-2 min-h-64">
              <div className="font-medium text-sm mb-2">
                {day.day}
                <span className="text-gray-500 ml-1">{day.date}</span>
              </div>
              <div className="relative">
                {day.tasks.map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className="p-2 rounded-md w-full mb-1 bg-blue-100 text-blue-800"
                  >
                    <div className="font-medium">{task.projectName}</div>
                    <div className="text-sm">{task.taskName}</div>
                    <div className="text-xs mt-1">{task.hours} hs</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
};

export default CalendarView;