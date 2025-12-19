/**
 * GymSense Landing Page
 * 
 * Placeholder for now - will be built out with full marketing content.
 */

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
        {/* Logo */}
        <h1 className="font-display text-6xl md:text-8xl text-emerald-600 mb-6">
          GymSense
        </h1>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 mb-8">
          Modern gym management for the modern gym
        </p>
        
        {/* Coming Soon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Coming Soon
        </div>
      </div>
    </main>
  );
}

