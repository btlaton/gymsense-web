/**
 * Guest Pass Landing Page
 * 
 * Simple landing page for prospective guests to sign up before visiting.
 * Linked from gym's Instagram/social media.
 * 
 * URL: gymsense.io/atlas/guest-pass (where atlas is the gym slug)
 * 
 * Flow:
 * 1. User enters name and email
 * 2. Submits form → Edge Function creates customer, sends welcome email
 * 3. Success state with instructions to download app
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { User, Mail, Check, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase Edge Function URL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ldwwiiiskujewcluclbx.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// App store links
const APP_LINKS = {
  ios: 'https://gymsense.io/download/ios',
  android: 'https://gymsense.io/download/android',
};

interface GymInfo {
  id: string;
  name: string;
  slug: string;
}

export default function GuestPassPage() {
  const params = useParams();
  const gymSlug = params.gymSlug as string;
  
  // State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gym, setGym] = useState<GymInfo | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Fetch gym info by slug
  useEffect(() => {
    async function fetchGym() {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const { data, error: fetchError } = await supabase
          .from('gyms')
          .select('id, name, slug')
          .eq('slug', gymSlug.toLowerCase())
          .single();
        
        if (fetchError || !data) {
          console.error('Gym not found:', fetchError);
          setError('Gym not found. Please check the URL.');
          setLoading(false);
          return;
        }
        
        setGym(data);
        setLoading(false);
      } catch {
        setError('Unable to load gym information');
        setLoading(false);
      }
    }
    
    if (gymSlug) {
      fetchGym();
    }
  }, [gymSlug]);
  
  // Validate form
  const isValid = name.trim().length >= 2 && email.includes('@') && email.includes('.');
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValid || submitting) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/create-guest-prospect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          gymSlug,
          name: name.trim(),
          email: email.trim().toLowerCase(),
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
      
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-stone-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
          <p className="mt-4 text-stone-400">Loading...</p>
        </div>
      </main>
    );
  }
  
  // Success state
  if (success) {
    return (
      <main className="min-h-screen bg-stone-950">
        {/* Header */}
        <header className="px-6 py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="font-display text-2xl text-emerald-500 mb-1">
              gymsense
            </div>
          </div>
        </header>
        
        <div className="max-w-md mx-auto px-6 py-8">
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-emerald-500">
              <Check className="w-10 h-10 text-emerald-500" strokeWidth={2.5} />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Check Your Email!
            </h1>
            
            <p className="text-stone-400 text-lg mb-8">
              We&apos;ve sent your activation code to <span className="text-white font-medium">{email}</span>
            </p>
            
            {/* Next Steps */}
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 text-left mb-8">
              <h2 className="text-lg font-semibold text-white mb-4">Next Steps</h2>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/50">
                    <span className="text-emerald-500 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Download the gymsense app</p>
                    <p className="text-stone-400 text-sm">Available on iOS and Android</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/50">
                    <span className="text-emerald-500 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Enter your activation code</p>
                    <p className="text-stone-400 text-sm">Use the 4-digit code from your email</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/50">
                    <span className="text-emerald-500 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Purchase your guest pass</p>
                    <p className="text-stone-400 text-sm">Day pass or week pass - your choice!</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 border border-emerald-500/50">
                    <span className="text-emerald-500 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Visit the gym!</p>
                    <p className="text-stone-400 text-sm">Check in with the app when you arrive</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* App Download Links */}
            <div className="space-y-3">
              <a
                href={APP_LINKS.ios}
                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
              >
                Download for iPhone
                <ArrowRight className="w-5 h-5" />
              </a>
              
              <a
                href={APP_LINKS.android}
                className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-stone-800 hover:bg-stone-700 text-white font-semibold rounded-xl border border-stone-700 transition-colors"
              >
                Download for Android
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="px-6 py-8 mt-8">
          <div className="max-w-md mx-auto text-center">
            <p className="text-stone-500 text-sm">
              Questions? Ask the front desk when you arrive.
            </p>
          </div>
        </footer>
      </main>
    );
  }
  
  // Form state
  return (
    <main className="min-h-screen bg-stone-950">
      {/* Header */}
      <header className="px-6 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="font-display text-2xl text-emerald-500 mb-1">
            gymsense
          </div>
        </div>
      </header>
      
      <div className="max-w-md mx-auto px-6 py-4">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-3">
            Get Your Guest Pass for {gym?.name || 'the Gym'}
          </h1>
          
          <p className="text-stone-400 text-lg">
            Sign up below and we&apos;ll email you instructions to purchase a day or week pass.
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-400 mb-2">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full pl-12 pr-4 py-4 bg-stone-900 border border-stone-800 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                disabled={submitting}
                required
              />
            </div>
          </div>
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full pl-12 pr-4 py-4 bg-stone-900 border border-stone-800 rounded-xl text-white placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                disabled={submitting}
                required
              />
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || submitting}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
              isValid && !submitting
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </span>
            ) : (
              'Get My Guest Pass'
            )}
          </button>
        </form>
        
        {/* Info */}
        <p className="text-center text-stone-500 text-sm">
          We&apos;ll send you an email with instructions to download the app and purchase your guest pass.
        </p>
      </div>
      
      {/* Footer */}
      <footer className="px-6 py-12 mt-8">
        <div className="max-w-md mx-auto text-center">
          <div className="font-display text-xl text-emerald-600 mb-2">
            gymsense
          </div>
          <p className="text-stone-500 text-sm">
            Powering modern gyms
          </p>
        </div>
      </footer>
    </main>
  );
}

