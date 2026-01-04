'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';

export default function UserGuideLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectPath = searchParams.get('redirect') || '/user-guide';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Redirect with password param - middleware will validate and set cookie
    const url = new URL(redirectPath, window.location.origin);
    url.searchParams.set('password', password);
    router.push(url.toString());
  };
  
  return (
    <main className="min-h-screen bg-stone-950 text-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-emerald-500 mb-2">gymsense</h1>
          <p className="text-stone-500 text-sm">User Guide Access</p>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-stone-400 text-sm mb-2">
              Enter Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-900 border border-stone-700 rounded-xl pl-10 pr-4 py-3 text-stone-50 placeholder:text-stone-600 focus:outline-none focus:border-emerald-600 transition-colors"
                required
              />
            </div>
          </div>
          
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {isLoading ? 'Accessing...' : 'Access Guide'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        {/* Help Link */}
        <p className="text-center text-stone-600 text-xs mt-6">
          Password provided by gym owner.{' '}
          <a href="mailto:support@gymsense.io" className="text-emerald-600 hover:text-emerald-500">
            Need help?
          </a>
        </p>
      </div>
    </main>
  );
}

