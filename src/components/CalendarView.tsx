'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NewTaskPopUp from './NewTaskPopUp';
import ModifyTaskPopup from './ModifyTaskWork';
import Cookies from 'js-cookie';
import ProfileSelector from './ProfileSelector';
import { Resource, TaskData, TaskWork } from '@/app/interfaces/types';

const CalendarView = () => {
  const [resourceId, setResourceId] = useState(Cookies.get('resourceId') || '2e6ecd47-fa18-490e-b25a-c9101a398b6d');
  const [resources, setResources] = useState<Resource[]>([]);
  const [tasks, setTasks] = useState<TaskWork[]>([]);
  const [startDate, setStartDate] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(today.setDate(diff));
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModifyPopupOpen, setIsModifyPopupOpen] = useState(false);
  const [taskToModify, setTaskToModify] = useState<TaskWork | null>(null);

  useEffect(() => {
    fetch('https://squad05-2024-2c.onrender.com/resources')
      .then(res => res.json())
      .then(data => setResources(data));
  }, []);

  useEffect(() => {
    fetch(`https://squad05-2024-2c.onrender.com/resources/${resourceId}/task-works`)
      .then(res => res.json())
      .then(data => {
        console.log('Sample task date:', data[0]?.createdAt);
        setTasks(data);
      });
  }, [resourceId]);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getProjectColor = (projectName: string) => {
    const colors = {
      default: { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Project A': { bg: 'bg-green-100', text: 'text-green-800' },
      'Project B': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Project C': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'Project D': { bg: 'bg-pink-100', text: 'text-pink-800' },
      'Project E': { bg: 'bg-orange-100', text: 'text-orange-800' },
    };

    const projectHash = projectName.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const colorKeys = Object.keys(colors).filter(key => key !== 'default');
    const fallbackColor = colors[colorKeys[projectHash % colorKeys.length] as keyof typeof colors];

    return colors[projectName as keyof typeof colors] || fallbackColor;
  };

  const handleSubmitTask = async (taskData: TaskData) => {
    try {
      const response = await fetch('https://squad05-2024-2c.onrender.com/task-work', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hours: Number(taskData.hours),
          createdAt: taskData.createdAt,
          taskId: taskData.taskId,
          resourceId: resourceId
        }),
      });

      if (response.ok) {
        const updatedTasks = await fetch(`https://squad05-2024-2c.onrender.com/resources/${resourceId}/task-works`).then(res => res.json());
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleAddTaskWork = (date: string) => {
    const [day, month] = date.split('/');
    const year = new Date().getFullYear();
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    setIsModalOpen(true);
  };

  const handleDeleteTaskWork = async (id: number) => {
    try {
      const response = await fetch(`https://squad05-2024-2c.onrender.com/task-work/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedTasks = await fetch(`https://squad05-2024-2c.onrender.com/resources/${resourceId}/task-works`).then(res => res.json());
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleModifyTask = (task: TaskWork) => {
    setTaskToModify(task);
    setIsModifyPopupOpen(true);
  };

  const handleModifySubmit = async (newHours: number) => {
    if (!taskToModify) return;

    try {
      const response = await fetch(`https://squad05-2024-2c.onrender.com/task-work/${taskToModify.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHours),
      });

      if (response.ok) {
        const updatedTasks = await fetch(`https://squad05-2024-2c.onrender.com/resources/${resourceId}/task-works`).then(res => res.json());
        setTasks(updatedTasks);
        setIsModifyPopupOpen(false);
      }
    } catch (error) {
      console.error('Error modifying task:', error);
    }
  };

  const handlePreviousWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() - 7);
    setStartDate(newStartDate);
  };

  const handleNextWeek = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(startDate.getDate() + 7);
    setStartDate(newStartDate);
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

  return (
    <div className="bg-gray w-full max-w-6xl mx-auto p-4">
      <div className="flex justify-end mb-4">
        <div className="flex items-center gap-2 justify-end mb-4">
          <ProfileSelector
            resources={resources}
            selectedId={resourceId}
            onChange={(id) => {
              setResourceId(id);
              Cookies.set('resourceId', id);
            }}
          />
        </div>
      </div>

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
            <div className="text-black text-xl font-semibold">
              Comienzo de Semana: {startDate.toLocaleDateString('es-ES')}
            </div>
            <div className="w-24"></div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div key={index} className="border-2 border-gray-600 rounded-lg p-2 min-h-64">
                <div className="font-medium text-black mb-2">
                  {day.day}
                  <span className="text-black ml-1">{day.date}</span>
                </div>
                <div className="space-y-2">
                  {day.tasks.map((task, taskIndex) => {
                    const { bg, text } = getProjectColor(task.projectName);
                    return (
                      <div
                        key={taskIndex}
                        className={`relative p-2 rounded-md w-full ${bg} ${text}`}
                      >
                        <div className="font-medium">{task.projectName}</div>
                        <div className="text-sm">{task.taskName}</div>
                        <div className="text-xs mt-1">{task.hours} hs</div>
                        <div className="absolute bottom-2 w-full flex justify-between px-2">
                          <div className="flex-1"></div>
                          <button
                            onClick={() => handleModifyTask(task)}
                            className="mx-auto"
                          >
                            <Image src="/lapicito.svg" alt="modify" width={20} height={20} />
                          </button>
                          <button onClick={() => handleDeleteTaskWork(task.id)}>
                            <Image src="/delete.svg" alt="delete" width={20} height={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center mt-2">
                  <button
                    className="text-black font-semibold"
                    onClick={() => handleAddTaskWork(day.date)}
                  >
                    <Image src="/new_task.svg" alt="plus" width={30} height={30} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NewTaskPopUp
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSubmit={handleSubmitTask}
      />
      {taskToModify && (
        <ModifyTaskPopup
          isOpen={isModifyPopupOpen}
          onClose={() => setIsModifyPopupOpen(false)}
          taskName={taskToModify.taskName}
          initialHours={taskToModify.hours}
          onSubmit={handleModifySubmit}
        />
      )}
    </div>
  );
};

export default CalendarView;