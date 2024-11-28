'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NewTaskPopUp from './NewTaskPopUp';
import ModifyTaskPopup from './ModifyTaskWork';
import Cookies from 'js-cookie';
import ProfileSelector from './ProfileSelector';
import TaskCard from './TaskCard';
import { Resource, TaskData, TaskWork } from '@/app/interfaces/types';
import DeleteConfirmation from './DeleteConfirmation';

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
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    taskId: number | null;
    taskName: string;
  }>({
    isOpen: false,
    taskId: null,
    taskName: ''
  });

  const SQUAD_5_API = 'https://squad05-2024-2c.onrender.com';

  useEffect(() => {
    fetch(`${SQUAD_5_API}/resources`)
      .then(res => res.json())
      .then(data => setResources(data));
  }, []);

  useEffect(() => {
    fetch(`${SQUAD_5_API}/resources/${resourceId}/task-works`)
      .then(res => res.json())
      .then(data => setTasks(data));
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
      const response = await fetch(`${SQUAD_5_API}/task-work`, {
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
        const updatedTasks = await fetch(`${SQUAD_5_API}/resources/${resourceId}/task-works`).then(res => res.json());
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleAddTaskWork = (date: string) => {
    const [day, month] = date.split('/');
    const year = startDate.getFullYear();
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    setIsModalOpen(true);
  };

  const handleDeleteTaskWork = (id: number) => {
    const taskToDelete = tasks.find(task => task.id === id);
    if (!taskToDelete) return;

    setDeleteConfirmation({
      isOpen: true,
      taskId: id,
      taskName: taskToDelete.taskName
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.taskId) return;

    try {
      const response = await fetch(`${SQUAD_5_API}/task-work/${deleteConfirmation.taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedTasks = await fetch(`${SQUAD_5_API}/resources/${resourceId}/task-works`).then(res => res.json());
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setDeleteConfirmation({ isOpen: false, taskId: null, taskName: '' });
    }
  };

  const handleModifyTask = (task: TaskWork) => {
    setTaskToModify(task);
    setIsModifyPopupOpen(true);
  };

  const handleModifySubmit = async (newHours: number) => {
    if (!taskToModify) return;

    try {
      const response = await fetch(`${SQUAD_5_API}/task-work/${taskToModify.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHours),
      });

      if (response.ok) {
        const updatedTasks = await fetch(`${SQUAD_5_API}/resources/${resourceId}/task-works`).then(res => res.json());
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

  const NavigationButton = ({ onClick, direction }: { onClick: () => void; direction: 'left' | 'right' }) => (
    <button
      onClick={onClick}
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
        <path d={direction === 'left' ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );

  return (
    <div className="bg-gray w-full max-w-[90vw] mx-auto p-4">
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
        <div className="bg-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <NavigationButton onClick={handlePreviousWeek} direction="left" />
              <NavigationButton onClick={handleNextWeek} direction="right" />
            </div>
            <div className="text-black text-xl font-semibold">
              Comienzo de Semana: {startDate.toLocaleDateString('es-ES')}
            </div>
            <div className="w-32"></div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {days.map((day, index) => (
              <div key={index} className="border-2 border-gray-600 rounded-lg p-4 min-h-[300px]">
                <div className="font-medium text-black mb-3">
                  {day.day}
                  <span className="text-black ml-2">{day.date}</span>
                </div>

                <div className="space-y-3">
                  {day.tasks.map((task, taskIndex) => (
                    <TaskCard
                      key={taskIndex}
                      task={task}
                      projectColors={getProjectColor(task.projectName)}
                      onModify={handleModifyTask}
                      onDelete={handleDeleteTaskWork}
                    />
                  ))}
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    className="text-black font-semibold hover:bg-gray-100 p-2 rounded-full"
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
      <DeleteConfirmation
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, taskId: null, taskName: '' })}
        onConfirm={confirmDelete}
        taskName={deleteConfirmation.taskName}
      />
    </div>
  );
};

export default CalendarView;