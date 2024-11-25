import Navbar from '@/components/Navbar'
import ReportView from '@/components/ReportsView'

export default function ReportPage() {
 return (
   <main className="flex min-h-screen flex-col items-center p-24">
     <Navbar />
     <h1 className="mb-8 text-white font-Helvetica text-4xl">Project Reports</h1>
     <ReportView />
   </main>
 )
}