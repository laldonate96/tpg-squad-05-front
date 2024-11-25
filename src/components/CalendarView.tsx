'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import NewTaskPopUp from './NewTaskPopUp';
import ModifyTaskPopup from './ModifyTaskWork';

interface Task {
  id: number;
  taskName: string;
  projectName: string;
  createdAt: string;
  hours: number;
}

const CalendarView = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModifyPopupOpen, setIsModifyPopupOpen] = useState(false);
  const [taskToModify, setTaskToModify] = useState<Task | null>(null);

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

  const handleSubmitTask = async (taskData: any) => {
    try {
      const response = await fetch('https://squad05-2024-2c.onrender.com/task-work', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hours: Number(taskData.hours),
          createdAt: taskData.createdAt,
          taskId: taskData.taskId
        }),
      });

      if (response.ok) {
        const updatedTasks = await fetch('https://squad05-2024-2c.onrender.com/task-work').then(res => res.json());
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
        const updatedTasks = await fetch('https://squad05-2024-2c.onrender.com/task-work').then(res => res.json());
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  const handleModifyTask = (task: Task) => {
    setTaskToModify(task);
    setIsModifyPopupOpen(true);
  };

  const handleModifySubmit = async (newHours: number) => {
    if (!taskToModify) return;

    try {
      const response = await fetch(`https://squad05-2024-2c.onrender.com/task-work/${taskToModify.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hours: newHours,
        }),
      });

      if (response.ok) {
        const updatedTasks = await fetch('https://squad05-2024-2c.onrender.com/task-work').then(res => res.json());
        setTasks(updatedTasks); // Update the task list
        setIsModifyPopupOpen(false); // Close the popup
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
                <div className="space-y-2">
                  {day.tasks.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className="relative p-2 rounded-md w-full bg-blue-100 text-blue-800"
                    >
                      <div className="font-medium">{task.projectName}</div>
                      <div className="text-sm">{task.taskName}</div>
                      <div className="text-xs mt-1">{task.hours} hs</div>
                      <div className="absolute bottom-2 right-2">
                        <button onClick={() => handleDeleteTaskWork(task.id)}>
                          <Image src="/delete.svg" alt="delete" width={20} height={20} />
                        </button>
                        <button onClick={() => handleModifyTask(task)}>
                          <Image src="/lapicito.svg" alt="modify" width={20} height={20} />
                        </button>
                      </div>
                    </div>
                  ))}
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