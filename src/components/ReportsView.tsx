'use client';
import Link from 'next/link';
import { useState } from 'react';

interface Project {
 id: string;
 name: string;
 totalHours: number;
}

interface Resource {
 id: string;
 name: string;
}

export default function ReportsView() {
 const [selectedProject, setSelectedProject] = useState<string>('');
 const [selectedResources, setSelectedResources] = useState<string[]>([]);

 const projects: Project[] = [
   { id: '1', name: 'CRM', totalHours: 115 },
   { id: '2', name: 'ERP', totalHours: 220 },
 ];

 const resources: Resource[] = [
   { id: '1', name: 'John Doe' },
   { id: '2', name: 'James Anderson' },
   { id: '3', name: 'Olivia Thompson' },
   { id: '4', name: 'Michael Johnson' },
 ];

 return (
   <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
     <div className="grid grid-cols-4 gap-6">
       <div>
         <label className="block text-sm font-medium mb-2">Project</label>
         <select
           className="w-full border rounded-md p-2"
           onChange={(e) => setSelectedProject(e.target.value)}
           value={selectedProject}
         >
           <option value="">Select project</option>
           {projects.map(project => (
             <option key={project.id} value={project.id}>{project.name}</option>
           ))}
         </select>
       </div>

       <div>
         <label className="block text-sm font-medium mb-2">Total Hours</label>
         <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">
           {selectedProject ?
             `${projects.find(p => p.id === selectedProject)?.totalHours}h` :
             '-'}
         </div>
       </div>

       <div>
         <label className="block text-sm font-medium mb-2">Resources</label>
         <select className="w-full border rounded-md p-2">
           {resources.map(resource => (
             <option key={resource.id} value={resource.id}>{resource.name}</option>
           ))}
         </select>
       </div>

       <div className="flex items-end">
         <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
           Generate Report
         </button>
       </div>
     </div>
   </div>
 );
}