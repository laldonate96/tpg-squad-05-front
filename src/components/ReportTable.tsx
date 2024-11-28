import React from 'react';
import { ReportModalProps, MonthlyHours } from '../app/interfaces/types';

const ReportTable: React.FC<ReportModalProps> = ({ data, rolePrices }) => {
  if (!data) return null;

  const months: { key: keyof MonthlyHours; label: string }[] = [
    { key: 'january', label: 'Enero' },
    { key: 'february', label: 'Febrero' },
    { key: 'march', label: 'Marzo' },
    { key: 'april', label: 'Abril' },
    { key: 'may', label: 'Mayo' },
    { key: 'june', label: 'Junio' },
    { key: 'july', label: 'Julio' },
    { key: 'august', label: 'Agosto' },
    { key: 'september', label: 'Septiembre' },
    { key: 'october', label: 'Octubre' },
    { key: 'november', label: 'Noviembre' },
    { key: 'december', label: 'Diciembre' }
  ];

  const calculateCost = (hours: number, rolId: string) => {
    const pricePerHour = rolePrices[rolId] || 0;
    return hours * pricePerHour;
  };

  const monthlyTotals = months.reduce((acc, month) => {
    const totalHours = data.resources.reduce((sum, resource) =>
      sum + resource.monthlyHours[month.key], 0
    );
    const totalCost = data.resources.reduce((sum, resource) =>
      sum + calculateCost(resource.monthlyHours[month.key], resource.rolId), 0
    );
    acc[month.key] = { hours: totalHours, cost: totalCost };
    return acc;
  }, {} as Record<keyof MonthlyHours, { hours: number; cost: number }>);

  const finalTotal = {
    hours: data.resources.reduce((sum, resource) => sum + resource.totalHours, 0),
    cost: data.resources.reduce((sum, resource) =>
      sum + calculateCost(resource.totalHours, resource.rolId), 0
    )
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reporte de Horas - {data.year}</h2>
        <p className="text-gray-600">Total de Recursos: {data.totalResources} | Total de Horas: {data.totalHours}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left font-semibold text-black border" style={{ backgroundColor: '#a9d1de' }}>
                Recursos
              </th>
              {months.map(month => (
                <th key={month.key} className="p-3 text-center font-semibold text-black border whitespace-nowrap" style={{ backgroundColor: '#a9d1de' }}>
                  {month.label}
                  <div className="text-xs font-normal">h/costo</div>
                </th>
              ))}
              <th className="p-3 text-center font-semibold text-black border" style={{ backgroundColor: '#a9d1de' }}>
                Total
                <div className="text-xs font-normal">h/costo</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.resources.map((resource) => (
              <tr key={resource.resourceId} className="hover:bg-gray-50">
                <td className="p-3 border font-medium text-gray-800" style={{ backgroundColor: '#e0f7fa' }}>
                  {resource.nombre} {resource.apellido}
                </td>
                {months.map(month => (
                  <td key={month.key} className="p-3 border text-center text-gray-700" style={{ backgroundColor: '#e0f7fa' }}>
                    {resource.monthlyHours[month.key]}/
                    {calculateCost(resource.monthlyHours[month.key], resource.rolId)}
                  </td>
                ))}
                <td className="p-3 border text-gray-700 text-center font-medium" style={{ backgroundColor: '#e0f7fa' }}>
                  {resource.totalHours}/{calculateCost(resource.totalHours, resource.rolId)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="p-3 border text-black" style={{ backgroundColor: '#a9d1de' }}>
                TOTALES
              </td>
              {months.map(month => (
                <td key={month.key} className="p-3 border text-center text-black" style={{ backgroundColor: '#a9d1de' }}>
                  {monthlyTotals[month.key].hours}/
                  {monthlyTotals[month.key].cost}
                </td>
              ))}
              <td className="p-3 border text-center text-black" style={{ backgroundColor: '#a9d1de' }}>
                {finalTotal.hours}/{finalTotal.cost}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;