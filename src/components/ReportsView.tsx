'use client';
import { useEffect, useState } from 'react';
import ReportModal from './ReportModal';
import { Project, ReportData, Resource, RolePrice } from '../app/interfaces/types';


export default function ReportsView() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalHours, setTotalHours] = useState<number | null>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [rolePrices, setRolePrices] = useState<RolePrice>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [priceError, setPriceError] = useState<string>('');

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 11 },
    (_, i) => (currentYear - 10 + i).toString()
  ).reverse();

  const SQUAD_5_API = 'https://squad05-2024-2c.onrender.com';
  const SQUAD_11_API = 'https://squad11-2024-2c.onrender.com';

  useEffect(() => {
    fetch(`${SQUAD_5_API}/projects`)
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
      fetch(`${SQUAD_5_API}/projects/${selectedProject}/hours`)
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
      fetch(`${SQUAD_5_API}/projects/${selectedProject}/resources`)
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

  useEffect(() => {
    const fetchRolePrices = async () => {
      if (selectedResources.length === 0) {
        setRolePrices({});
        return;
      }

      setIsLoadingPrices(true);
      setPriceError('');
      const prices: RolePrice = {};

      try {
        await Promise.all(
          selectedResources.map(async (resource) => {
            try {
              const response = await fetch(`${SQUAD_11_API}/api/role/${resource.rolId}`);

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              prices[resource.rolId] = data.cuesta_hora;
            } catch (error) {
              console.log(`Error fetching role price for role ${resource.rolId}:`, error);
              prices[resource.rolId] = getDefaultRolePrice(resource.rolId);
            }
          })
        );

        setRolePrices(prices);
      } catch (error) {
        console.error('Error fetching role prices:', error);
        setPriceError('Este proyecto no tiene recursos asignados.');

        const defaultPrices: RolePrice = {};
        selectedResources.forEach(resource => {
          defaultPrices[resource.rolId] = getDefaultRolePrice(resource.rolId);
        });
        setRolePrices(defaultPrices);
      } finally {
        setIsLoadingPrices(false);
      }
    };

    fetchRolePrices();
  }, [selectedResources]);

  const getDefaultRolePrice = (roleId: string): number => {
    const defaultPrices: { [key: string]: number } = {
      'developer': 50,
      'senior': 75,
      'manager': 100,
    };

    return defaultPrices[roleId] || 50;
  };

  const handleGenerateReport = async () => {
    try {
      const response = await fetch(`${SQUAD_5_API}/projects/${selectedProject}/resources/hours/${selectedYear}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ReportData = await response.json();

      setReportData({
        ...data,
        resources: data.resources.map(resource => ({
          ...resource,
          rolId: selectedResources.find(r => r.id === resource.resourceId)?.rolId || ''
        }))
      });
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  return (
    <>
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
            {selectedResources.length > 0 ? (
              <select className="w-full border rounded-md p-2">
                {selectedResources.map(resource => (
                  <option key={resource.id} value={resource.id}>
                    {resource.nombre} {resource.apellido}
                  </option>
                ))}
              </select>
            ) : (
              <div className="h-10 px-3 text-black py-2 border rounded-md flex items-center">
                -
              </div>
            )}
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
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              onClick={handleGenerateReport}
              disabled={!selectedProject || !selectedYear || isLoadingPrices}
            >
              {isLoadingPrices ? 'Cargando...' : 'Generar Reporte'}
            </button>
          </div>
        </div>

        {priceError && (
          <div className="mt-4 p-2 bg-yellow-100 text-yellow-800 rounded">
            {priceError}
          </div>
        )}
      </div>

      {reportData && (
        <ReportModal
          data={reportData}
          rolePrices={rolePrices}
          onClose={() => setReportData(null)}
        />
      )}
    </>
  );
}