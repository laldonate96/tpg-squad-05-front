'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Task {
  id: number;
  taskName: string;
  projectName: string;
  createdAt: string;
  hours: number;
}

const CalendarView = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date('2024-11-23T00:00:00')); // Initial starting date

  useEffect(() => {
    fetch('https://squad05-2024-2c.onrender.com/task-work')
      .then(res => res.json())
      .then(data => {
        console.log('Sample task date:', data[0]?.createdAt);
        setTasks(data);
      });
  }, []);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const days = Array(7)
    .fill(null)
    .map((_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);

      const tasksForDay = tasks.filter(task => {
        const taskDate = formatDate(new Date(task.createdAt));
        const compareDate = formatDate(date);
        return taskDate === compareDate;
      });

      return {
        date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        day: date.toLocaleDateString('es-ES', { weekday: 'long' }),
        tasks: tasksForDay,
      };
    });

  const handlePreviousWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 7); // Move back 7 days
    setStartDate(newStartDate);
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 7); // Move forward 7 days
    setStartDate(newStartDate);
  };

  const handleDeleteTaskWork = () => {
    
  }

  const handleAddTaskWork = () => {
    console.log("click")
  }

  return (
    <div className="bg-gray w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg">
        <div className="bg-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button
                onClick={handlePreviousWeek}
                className="border-2 border-gray-600 hover:bg-gray-300 p-2 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={handleNextWeek}
                className="border-2 border-gray-600 hover:bg-gray-300 p-2 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
            <div className="text-black font-semibold">
              Week starting: {startDate.toLocaleDateString('es-ES')}
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div key={index} className="border-2 border-gray-600 rounded-lg p-2 min-h-64">
                <div className="font-medium text-black mb-2">
                  {day.day}
                  <span className="text-black ml-1">{day.date}</span>
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
                <div className="flex justify-center">
                  <button className="text-black font-semibold" onClick={handleAddTaskWork}>
                    <Image src="/new_task.svg" alt="plus" width={30} height={30} />
                  </button>
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
