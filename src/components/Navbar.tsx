'use client';
import Link from 'next/link';
import { ArrowRightCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-4 right-4 z-10">
      <div className="bg-white shadow-lg rounded-lg">
        <Link 
          href="/finance-module" 
          className="flex items-center gap-2 px-4 py-2 text-black hover:text-blue-600 transition-colors duration-200"
        >
          <span>Ir a modulo de finanzas</span>
          <ArrowRightCircle className="w-5 h-5" />
        </Link>
      </div>
    </nav>
  );
}
