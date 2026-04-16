'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight hover:text-indigo-200 transition-colors">
              PeptideMarket
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-indigo-200 transition-colors">Home</Link>
              <Link href="/vendors" className="hover:text-indigo-200 transition-colors">Vendors</Link>
              {session && <Link href="/favorites" className="hover:text-indigo-200 transition-colors">Favorites</Link>}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            {session ? (
              <>
                <span className="text-indigo-200">Hi, {session.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-indigo-200 transition-colors">Login</Link>
                <Link href="/register" className="bg-white text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-md transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
