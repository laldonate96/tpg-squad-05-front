import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { AddTaskModalProps, Project, Task, TaskData } from '@/app/interfaces/types';

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSubmit
}) => {
  const resourceId = Cookies.get('resourceId') || '2e6ecd47-fa18-490e-b25a-c9101a398b6d';
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [taskData, setTaskData] = useState<TaskData>({
    taskId: '',
    hours: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTasks();
      fetchProjects();
    }
  }, [isOpen, resourceId]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('https://squad05-2024-2c.onrender.com/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const projectList = await response.json();
      setProjects(projectList);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Error loading projects. Please try again.');
    }
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://squad05-2024-2c.onrender.com/resource/${resourceId}/task`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setAvailableTasks(data);
    } catch (err) {
      setError('Error loading tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = availableTasks.filter(
    task => selectedProjectId ? task.proyectoId === selectedProjectId : true
  );

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
    setTaskData(prev => ({ ...prev, taskId: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectedTask = availableTasks.find(task => task.id === taskData.taskId);

    if (!selectedTask) {
      setError('Please select a task');
      return;
    }

    const submissionData: TaskData = {
      taskName: selectedTask.nombre,
      hours: taskData.hours,
      createdAt: selectedDate || undefined,
      taskId: taskData.taskId
    };

    onSubmit(submissionData);
    setTaskData({ taskId: '', hours: '' });
    setSelectedProjectId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-700">Añadir horas a la tarea</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="projectId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Elija un proyecto
            </label>
            <select
              id="projectId"
              value={selectedProjectId}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full p-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los proyectos</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="taskId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Elija la tarea
            </label>
            {isLoading ? (
              <div className="text-gray-500">Cargando tareas...</div>
            ) : (
              <select
                id="taskId"
                name="taskId"
                value={taskData.taskId}
                onChange={(e) => setTaskData(prev => ({ ...prev, taskId: e.target.value }))}
                className="w-full p-2 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione una tarea</option>
                {filteredTasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.nombre}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label
              htmlFor="hours"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Horas
            </label>
            <input
              id="hours"
              type="number"
              name="hours"
              min="0"
              max="12"
              step="1"
              value={taskData.hours}
              onChange={(e) => setTaskData(prev => ({ ...prev, hours: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Añadir horas"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Añadir horas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;