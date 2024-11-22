'use client';

import React from 'react';

const getTaskHeight = (duration: string) => {
  const hours = parseInt(duration);
  return {
    height: `${hours * 1.1}rem`,
    minHeight: '7rem'
  };
};

const CalendarView = () => {
  const days = [
    { date: '28/10', day: 'Lunes', tasks: [{ type: 'UX/UI', duration: '2', category: 'primary' }] },
    { date: '29/10', day: 'Martes', tasks: [
      { type: 'UX/UI', duration: '3', category: 'primary' },
      { type: 'Notificaciones por mail', duration: '6', category: 'warning' }
    ]},
    { date: '30/10', day: 'Miercoles', tasks: [
      { type: 'Notificaciones por mail', duration: '2', category: 'warning' },
      { type: 'UX/UI', duration: '2', category: 'primary' }
    ]},
    { date: '31/10', day: 'Jueves', tasks: [] },
    { date: '01/11', day: 'Viernes', tasks: [] },
    { date: '02/11', day: 'Sábado', tasks: [] },
    { date: '03/11', day: 'Domingo', tasks: [] }
  ];

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
            <div className="text-lg font-semibold">31/10/2024</div>
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
                      style={getTaskHeight(task.duration)}
                      className={`p-2 rounded-md w-full mb-1 ${
                        task.category === 'primary'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <div className="font-medium">CRM</div>
                      <div className="text-sm">{task.type}</div>
                      <div className="text-xs mt-1">{task.duration}</div>
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