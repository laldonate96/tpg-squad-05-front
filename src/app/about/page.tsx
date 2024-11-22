import Link from 'next/link'

export default function About() {
  return (
    <div className="p-24">
      <h1>About Page</h1>
      <p>This is the about page</p>
      <Link
        href="/"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        Back to Home
      </Link>
    </div>
  )
}