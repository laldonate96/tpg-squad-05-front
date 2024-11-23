import ClientCalendarWrapper from '@/components/ClientCalendarWrapper'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Navbar />
      <h1 className="mb-8 text-white font-Helvetica text-4xl">Carga de horas WEB</h1>
      <ClientCalendarWrapper />
    </main>
  )
}