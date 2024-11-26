'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Project {
  id: string;
  nombre: string;
}

interface Resource {
  id: string;
  nombre: string;
  apellido: string;
}

export default function ReportsView() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalHours, setTotalHours] = useState<number | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 11 },
    (_, i) => (currentYear - 10 + i).toString()
  ).reverse();

  useEffect(() => {
    fetch(`https://squad05-2024-2c.onrender.com/projects`)
      .then(res => res.json())
      .then(data => {
        setProjects(data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetch(`https://squad05-2024-2c.onrender.com/projects/${selectedProject}/hours`)
        .then(res => res.json())
        .then(data => {
          setTotalHours(data.totalHours);
        })
        .catch(error => {
          console.error('Error fetching project hours:', error);
          setTotalHours(null);
        });
    } else {
      setTotalHours(null);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      fetch(`https://squad05-2024-2c.onrender.com/projects/${selectedProject}/resources`)
        .then(res => res.json())
        .then(data => {
          setSelectedResources(data);
        })
        .catch(error => {
          console.error('Error fetching project resources:', error);
          setSelectedResources([]);
        });
    } else {
      setSelectedResources([]);
    }
  }, [selectedProject]);

  const handleGenerateReport = () => {
    console.log('Generating report for project:', selectedProject, 'year:', selectedYear);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="grid grid-cols-5 gap-6">
        <div>
          <label className="block text-sm text-black font-medium mb-2">Proyectos</label>
          <select
            className="w-full border rounded-md p-2"
            onChange={(e) => setSelectedProject(e.target.value)}
            value={selectedProject}
          >
            <option value="">Seleccionar Proyecto</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-black font-medium mb-2">Horas Totales</label>
          <div 
            className="h-10 px-3 text-black py-2 border rounded-md flex items-center"
            style={{ backgroundColor: '#e0f7fa' }}
          >
            {totalHours !== null ? `${totalHours}h` : '-'}
          </div>
        </div>

        <div>
          <label className="block text-sm text-black font-medium mb-2">Recursos</label>
          <select className="w-full border rounded-md p-2">
            {selectedResources.map(resource => (
              <option key={resource.id} value={resource.id}>{resource.nombre} {resource.apellido}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-black font-medium mb-2">Año</label>
          <select
            className="w-full border rounded-md p-2"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Seleccionar Año</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button 
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            onClick={handleGenerateReport}
          >
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}