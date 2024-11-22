'use client';

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <Link href="/" className="px-4 py-3 text-black hover:text-gray-700">Home</Link>
          <Link href="/about" className="px-4 py-3 text-black hover:text-gray-700">About</Link>
        </div>
      </div>
    </nav>
  )
}