'use client';
import Link from 'next/link';
import { ArrowRightCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
 const pathname = usePathname();
 const isReportsPage = pathname === '/reports';

 return (
   <nav className="fixed top-4 right-4 z-10">
     <div className="bg-gray-200 shadow-lg rounded-lg">
       <Link
         href="/finance-module"
         className="flex items-center gap-2 px-4 py-2 text-black hover:text-blue-600 transition-colors duration-200"
       >
         <span>Ir a modulo de finanzas</span>
         <ArrowRightCircle className="w-5 h-5" />
       </Link>
       <Link
         href={isReportsPage ? '/' : '/reports'}
         className="flex items-center gap-2 px-4 py-2 text-black hover:text-blue-600 transition-colors duration-200"
       >
         <span>{isReportsPage ? 'Ir a carga de horas' : 'Ir a reportes'}</span>
         <ArrowRightCircle className="w-5 h-5" />
       </Link>
     </div>
   </nav>
 );
}