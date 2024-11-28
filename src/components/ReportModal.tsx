import React from 'react';
import { X } from 'lucide-react';

const ReportModal: React.FC<ReportModalProps> = ({ data, rolePrices, onClose }) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Reporte de Horas - {data.year}</h2>
              <p className="text-gray-600">Total de Recursos: {data.totalResources} | Total de Horas: {data.totalHours}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left font-semibold text-black border" style={{ backgroundColor: '#a9d1de' }}>Recursos</th>
                  {months.map(month => (
                    <th key={month.key} className="p-3 text-center font-semibold text-black border whitespace-nowrap" style={{ backgroundColor: '#a9d1de' }} >
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;