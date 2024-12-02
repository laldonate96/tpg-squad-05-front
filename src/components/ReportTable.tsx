import React from 'react';
import { MonthlyHours, ReportTableProps } from '../app/interfaces/types';

const ReportTable: React.FC<ReportTableProps> = ({ data, rolePrices }) => {
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

  const getDefaultRolePrice = (rolId: string): number => {
    const defaultPrices: { [key: string]: number } = {
      'developer': 50,
      'senior': 75,
      'manager': 100,
    };
    return defaultPrices[rolId] || 50;
  };

  const calculateCost = (hours: number, rolId: string, monthIndex: number) => {
    const monthlyPrices = rolePrices[rolId];
    const pricePerHour = monthlyPrices ? monthlyPrices[monthIndex] : getDefaultRolePrice(rolId);
    return hours * pricePerHour;
  };

  const monthlyTotals = months.reduce((acc, month, monthIndex) => {
    const totalHours = data.resources.reduce((sum, resource) =>
      sum + (resource.monthlyHours[month.key] || 0), 0
    );
    const totalCost = data.resources.reduce((sum, resource) =>
      sum + calculateCost(resource.monthlyHours[month.key] || 0, resource.rolId, monthIndex), 0
    );
    acc[month.key] = { hours: totalHours, cost: totalCost };
    return acc;
  }, {} as Record<keyof MonthlyHours, { hours: number; cost: number }>);

  const finalTotal = {
    hours: data.resources.reduce((sum, resource) => sum + resource.totalHours, 0),
    cost: months.reduce((sum, _, monthIndex) =>
      sum + data.resources.reduce((resourceSum, resource) =>
        resourceSum + calculateCost(
          resource.monthlyHours[months[monthIndex].key] || 0,
          resource.rolId,
          monthIndex
        ),
      0),
    0)
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reporte de Horas - {data.year}</h2>
        <p className="text-gray-600">
          Total de Recursos: {data.totalResources} | Total de Horas: {formatNumber(data.totalHours)}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left font-semibold text-black border" style={{ backgroundColor: '#a9d1de' }}>
                Recursos
              </th>
              {months.map(month => (
                <th
                  key={month.key}
                  className="p-3 text-center font-semibold text-black border whitespace-nowrap"
                  style={{ backgroundColor: '#a9d1de' }}
                >
                  {month.label}
                  <div className="text-xs font-normal">h/costo</div>
                </th>
              ))}
              <th
                className="p-3 text-center font-semibold text-black border"
                style={{ backgroundColor: '#a9d1de' }}
              >
                Total
                <div className="text-xs font-normal">h/costo</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.resources.map((resource) => (
              <tr key={resource.resourceId} className="hover:bg-gray-50">
                <td
                  className="p-3 border font-medium text-gray-800"
                  style={{ backgroundColor: '#e0f7fa' }}
                >
                  {resource.nombre} {resource.apellido}
                </td>
                {months.map((month, monthIndex) => (
                  <td
                    key={month.key}
                    className="p-3 border text-center text-gray-700"
                    style={{ backgroundColor: '#e0f7fa' }}
                  >
                    {formatNumber(resource.monthlyHours[month.key] || 0)}/
                    {formatNumber(calculateCost(resource.monthlyHours[month.key] || 0, resource.rolId, monthIndex))}
                  </td>
                ))}
                <td
                  className="p-3 border text-gray-700 text-center font-medium"
                  style={{ backgroundColor: '#e0f7fa' }}
                >
                  {formatNumber(resource.totalHours)}/
                  {formatNumber(months.reduce((sum, _, monthIndex) =>
                    sum + calculateCost(
                      resource.monthlyHours[months[monthIndex].key] || 0,
                      resource.rolId,
                      monthIndex
                    ), 0
                  ))}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td
                className="p-3 border text-black"
                style={{ backgroundColor: '#a9d1de' }}
              >
                TOTALES
              </td>
              {months.map(month => (
                <td
                  key={month.key}
                  className="p-3 border text-center text-black"
                  style={{ backgroundColor: '#a9d1de' }}
                >
                  {formatNumber(monthlyTotals[month.key].hours)}/
                  {formatNumber(monthlyTotals[month.key].cost)}
                </td>
              ))}
              <td
                className="p-3 border text-center text-black"
                style={{ backgroundColor: '#a9d1de' }}
              >
                {formatNumber(finalTotal.hours)}/
                {formatNumber(finalTotal.cost)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;