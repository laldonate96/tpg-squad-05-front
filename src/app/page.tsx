import ClientCalendarWrapper from '@/components/ClientCalendarWrapper'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Navbar />
      <h1 className="mb-8 text-black font-bold text-2xl">Welcome to TPG Front</h1>
      <ClientCalendarWrapper />
    </main>
  )
}