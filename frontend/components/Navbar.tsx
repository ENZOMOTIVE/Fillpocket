import Link from 'next/link'
import { BeakerIcon } from '@heroicons/react/24/outline'

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-primary hover:text-primary/80"
            >
              <BeakerIcon className="h-6 w-6" />
              <span className="font-semibold text-xl">Fill Pocket: A Reward Based Clinical Trial</span>
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link
              href="/"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/clinical-trail"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary"
            >
              Create Trial
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

