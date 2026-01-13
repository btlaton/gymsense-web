/**
 * Sweathouse OC - Class Schedule & Booking Page
 * 
 * Customer-facing class schedule for booking classes.
 * Uses email from URL param to identify customer and their credits.
 * 
 * URL: gymsense.io/sweathouseoc/schedule?email=customer@example.com
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  X, Check, Loader2, ChevronLeft, ChevronRight, 
  Calendar, Clock, User, Users, AlertCircle, Download
} from 'lucide-react';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = 'https://ldwwiiiskujewcluclbx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkd3dpaWlza3VqZXdjbHVjbGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODg1MzksImV4cCI6MjA3OTA2NDUzOX0.6hErpbUmhLocUTnkPz09P_UBOCd-WL-ZrvcJkm9qt3c';

const BRAND = {
  primaryColor: '#1FB9D9',
  secondaryColor: '#FFFFFF',
  backgroundColor: '#000000',
  cardBackground: '#111111',
  logoUrl: 'https://www.sweathouseoc.com/wp-content/uploads/2024/08/Teal-and-WhiteSweatHouse-Logo.png',
  gymId: '7a23390d-f78d-475a-aacb-75bf0aa05ef0',
  gymName: 'Sweathouse OC - Mission Viejo',
  address: '27001 La Paz Rd, Mission Viejo, CA 92691',
};

const APP_LINKS = {
  ios: 'https://gymsense.io/download/ios',
  android: 'https://gymsense.io/download/android',
};

// ============================================================================
// TYPES
// ============================================================================

interface ClassInstance {
  id: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  booked_count: number;
  status: string;
  instructor_id: string | null;
  class_definition: {
    id: string;
    name: string;
  } | null;
  instructor: {
    id: string;
    first_name: string;
    last_name: string | null;
  } | null;
}

interface ClassCredit {
  id: string;
  credits_remaining: number;
  credits_used: number;
  expires_at: string | null;
  product: {
    name: string;
  } | null;
}

interface ClassBooking {
  id: string;
  class_instance_id: string;
  status: string;
  cancelled_at: string | null;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

// ============================================================================
// SUPABASE CLIENT
// ============================================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Los_Angeles'
  });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Los_Angeles'
  });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Los_Angeles'
  });
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getDayKey(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// ============================================================================
// COMPONENTS
// ============================================================================

function ClassCard({
  classInstance,
  isBooked,
  onBook,
}: {
  classInstance: ClassInstance;
  isBooked: boolean;
  onBook: () => void;
}) {
  const spotsRemaining = classInstance.capacity - (classInstance.booked_count || 0);
  const isFull = spotsRemaining <= 0;
  const isPast = new Date(classInstance.starts_at) < new Date();
  const instructorName = classInstance.instructor 
    ? `${classInstance.instructor.first_name}${classInstance.instructor.last_name ? ' ' + classInstance.instructor.last_name : ''}`
    : 'TBA';

  return (
    <div 
      className="rounded-xl p-4 mb-3"
      style={{ 
        backgroundColor: BRAND.cardBackground,
        border: isBooked ? `2px solid ${BRAND.primaryColor}` : '1px solid #333',
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-white font-semibold">{formatTime(classInstance.starts_at)}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{classInstance.class_definition?.name || 'Class'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <User className="w-4 h-4" />
            <span>with {instructorName}</span>
          </div>
        </div>
        
        <div className="text-right">
          {isBooked ? (
            <div 
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: `${BRAND.primaryColor}20`, color: BRAND.primaryColor }}
            >
              <Check className="w-4 h-4" />
              Booked
            </div>
          ) : isPast ? (
            <div className="px-3 py-2 rounded-lg text-sm text-gray-500">
              Past
            </div>
          ) : isFull ? (
            <div className="px-3 py-2 rounded-lg text-sm text-gray-500 bg-gray-800">
              Full
            </div>
          ) : (
            <button
              onClick={onBook}
              className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: BRAND.primaryColor, color: '#000' }}
            >
              Book
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
          
          {!isBooked && !isPast && !isFull && (
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 justify-end">
              <Users className="w-3 h-3" />
              {spotsRemaining}/{classInstance.capacity}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookingDrawer({
  classInstance,
  creditsRemaining,
  onConfirm,
  onClose,
  isLoading,
}: {
  classInstance: ClassInstance;
  creditsRemaining: number;
  onConfirm: () => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  const instructorName = classInstance.instructor 
    ? `${classInstance.instructor.first_name}${classInstance.instructor.last_name ? ' ' + classInstance.instructor.last_name : ''}`
    : 'TBA';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
      <div 
        className="w-full max-w-lg rounded-t-2xl p-6"
        style={{ backgroundColor: BRAND.cardBackground }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Confirm Booking</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-xl font-bold text-white mb-1">
            {classInstance.class_definition?.name || 'Class'}
          </div>
          <div className="text-gray-400">
            {formatDate(classInstance.starts_at)} at {formatTime(classInstance.starts_at)}
          </div>
          <div className="text-gray-400">
            with {instructorName}
          </div>
        </div>

        <div 
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
        >
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Credits to use</span>
            <span className="text-white font-semibold">1</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-400">Remaining after booking</span>
            <span className="font-semibold" style={{ color: BRAND.primaryColor }}>
              {creditsRemaining - 1}
            </span>
          </div>
        </div>

        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full py-4 rounded-lg font-semibold text-black uppercase tracking-wide transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ backgroundColor: BRAND.primaryColor }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Booking...
            </>
          ) : (
            'Confirm Booking'
          )}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          📱 Book and check in faster with the Gymsense Member app
        </p>
      </div>
    </div>
  );
}

function SuccessDrawer({
  classInstance,
  onBookAnother,
  onClose,
}: {
  classInstance: ClassInstance;
  onBookAnother: () => void;
  onClose: () => void;
}) {
  const instructorName = classInstance.instructor 
    ? `${classInstance.instructor.first_name}${classInstance.instructor.last_name ? ' ' + classInstance.instructor.last_name : ''}`
    : 'TBA';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60">
      <div 
        className="w-full max-w-lg rounded-t-2xl p-6"
        style={{ backgroundColor: BRAND.cardBackground }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${BRAND.primaryColor}30` }}
            >
              <Check className="w-4 h-4" style={{ color: BRAND.primaryColor }} />
            </div>
            <h3 className="text-lg font-bold text-white">Booked!</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-xl font-bold text-white mb-1">
            {classInstance.class_definition?.name || 'Class'}
          </div>
          <div className="text-gray-400">
            {formatDate(classInstance.starts_at)} at {formatTime(classInstance.starts_at)}
          </div>
          <div className="text-gray-400">
            with {instructorName}
          </div>
        </div>

        <div 
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="text-xl">📍</div>
            <div>
              <div className="text-white font-semibold">{BRAND.gymName}</div>
              <div className="text-gray-400 text-sm">{BRAND.address}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xl">⏰</div>
            <div className="text-gray-400 text-sm">Arrive 5 minutes early</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBookAnother}
            className="flex-1 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{ 
              backgroundColor: 'transparent',
              border: `1px solid ${BRAND.primaryColor}`,
              color: BRAND.primaryColor 
            }}
          >
            Book Another
          </button>
          <a
            href={APP_LINKS.ios}
            className="flex-1 py-3 rounded-lg font-semibold text-black text-center transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: BRAND.primaryColor }}
          >
            <Download className="w-4 h-4" />
            Get App
          </a>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SweatHouseSchedulePage() {
  // URL params
  const [email, setEmail] = useState<string | null>(null);
  
  // Data states
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [credits, setCredits] = useState<ClassCredit[]>([]);
  const [classInstances, setClassInstances] = useState<ClassInstance[]>([]);
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassInstance | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastBookedClass, setLastBookedClass] = useState<ClassInstance | null>(null);
  
  // Date navigation
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get email from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, []);

  // Calculate total remaining credits
  const totalCredits = useMemo(() => {
    return credits.reduce((sum, c) => sum + c.credits_remaining, 0);
  }, [credits]);

  // Fetch data when email is available
  useEffect(() => {
    if (!email) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      if (!email) return; // TypeScript guard
      
      setLoading(true);
      setError(null);

      try {
        // 1. Find customer by email
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id, name, email')
          .eq('email', email.toLowerCase().trim())
          .eq('gym_id', BRAND.gymId)
          .single();

        if (customerError || !customerData) {
          setError('Customer not found. Please complete a purchase first.');
          setLoading(false);
          return;
        }

        setCustomer(customerData);

        // 2. Fetch credits
        const { data: creditsData } = await supabase
          .from('class_credits')
          .select('id, credits_remaining, credits_used, expires_at, product:products(name)')
          .eq('customer_id', customerData.id)
          .eq('gym_id', BRAND.gymId)
          .eq('status', 'active')
          .gt('credits_remaining', 0);

        // Transform Supabase array relations to single objects
        const transformedCredits = (creditsData || []).map((c: any) => ({
          ...c,
          product: Array.isArray(c.product) ? c.product[0] || null : c.product,
        }));
        setCredits(transformedCredits);

        // 3. Fetch class instances for next 30 days
        const now = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

        const { data: instancesData } = await supabase
          .from('class_instances')
          .select(`
            id, starts_at, ends_at, capacity, booked_count, status, instructor_id,
            class_definition:class_definitions(id, name),
            instructor:team(id, first_name, last_name)
          `)
          .eq('gym_id', BRAND.gymId)
          .eq('status', 'scheduled')
          .gte('starts_at', now.toISOString())
          .lte('starts_at', thirtyDaysLater.toISOString())
          .order('starts_at', { ascending: true });

        // Transform Supabase array relations to single objects
        const transformedInstances = (instancesData || []).map((i: any) => ({
          ...i,
          class_definition: Array.isArray(i.class_definition) ? i.class_definition[0] || null : i.class_definition,
          instructor: Array.isArray(i.instructor) ? i.instructor[0] || null : i.instructor,
        }));
        setClassInstances(transformedInstances);

        // 4. Fetch customer's existing bookings
        const { data: bookingsData } = await supabase
          .from('class_bookings')
          .select('id, class_instance_id, status, cancelled_at')
          .eq('customer_id', customerData.id)
          .eq('gym_id', BRAND.gymId)
          .is('cancelled_at', null);

        setBookings(bookingsData || []);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load schedule. Please try again.');
      }

      setLoading(false);
    }

    fetchData();
  }, [email]);

  // Group classes by day
  const classesByDay = useMemo(() => {
    const grouped: Record<string, ClassInstance[]> = {};
    for (const instance of classInstances) {
      const key = getDayKey(instance.starts_at);
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(instance);
    }
    return grouped;
  }, [classInstances]);

  // Get dates with classes
  const datesWithClasses = useMemo(() => {
    const dates: Date[] = [];
    const seen = new Set<string>();
    for (const instance of classInstances) {
      const key = getDayKey(instance.starts_at);
      if (!seen.has(key)) {
        seen.add(key);
        dates.push(new Date(instance.starts_at));
      }
    }
    return dates;
  }, [classInstances]);

  // Get booked class IDs
  const bookedClassIds = useMemo(() => {
    return new Set(bookings.map(b => b.class_instance_id));
  }, [bookings]);

  // Navigate dates
  const goToPreviousDay = useCallback(() => {
    const currentIndex = datesWithClasses.findIndex(d => isSameDay(d, selectedDate));
    if (currentIndex > 0) {
      setSelectedDate(datesWithClasses[currentIndex - 1]);
    }
  }, [datesWithClasses, selectedDate]);

  const goToNextDay = useCallback(() => {
    const currentIndex = datesWithClasses.findIndex(d => isSameDay(d, selectedDate));
    if (currentIndex < datesWithClasses.length - 1) {
      setSelectedDate(datesWithClasses[currentIndex + 1]);
    }
  }, [datesWithClasses, selectedDate]);

  // Handle booking
  const handleBook = useCallback(async () => {
    if (!selectedClass || !email) return;

    setBookingLoading(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/book-class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          classInstanceId: selectedClass.id,
          gymId: BRAND.gymId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to book class');
        setBookingLoading(false);
        return;
      }

      // Update local state
      setBookings(prev => [...prev, {
        id: data.bookingId,
        class_instance_id: selectedClass.id,
        status: 'booked',
        cancelled_at: null,
      }]);

      // Update credits
      if (typeof data.creditsRemaining === 'number') {
        setCredits(prev => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[0] = { ...updated[0], credits_remaining: data.creditsRemaining };
          }
          return updated;
        });
      }

      // Show success
      setLastBookedClass(selectedClass);
      setSelectedClass(null);
      setShowSuccess(true);

    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to book class. Please try again.');
    }

    setBookingLoading(false);
  }, [selectedClass, email]);

  // Classes for selected date
  const classesForSelectedDate = useMemo(() => {
    const key = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;
    return classesByDay[key] || [];
  }, [classesByDay, selectedDate]);

  // No email provided
  if (!email && !loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: BRAND.backgroundColor, fontFamily: 'Roboto, sans-serif' }}
      >
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: BRAND.primaryColor }} />
          <h1 className="text-xl font-bold text-white mb-2">Email Required</h1>
          <p className="text-gray-400 mb-6">
            Please access this page from your purchase confirmation.
          </p>
          <a
            href="/sweathouseoc/mission-viejo"
            className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: BRAND.primaryColor, color: '#000' }}
          >
            View Class Packages
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: BRAND.backgroundColor, fontFamily: 'Roboto, sans-serif' }}
    >
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg border-b border-gray-800" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <img 
              src={BRAND.logoUrl} 
              alt="Sweathouse" 
              className="h-8 object-contain"
            />
            {totalCredits > 0 && (
              <div 
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{ backgroundColor: `${BRAND.primaryColor}20`, color: BRAND.primaryColor }}
              >
                {totalCredits} credit{totalCredits !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: BRAND.primaryColor }} />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-gray-400 mb-6">{error}</p>
            <a
              href="/sweathouseoc/mission-viejo"
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: BRAND.primaryColor, color: '#000' }}
            >
              Purchase Classes
            </a>
          </div>
        ) : totalCredits === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <h2 className="text-xl font-bold text-white mb-2">No Credits Available</h2>
            <p className="text-gray-400 mb-6">
              Purchase a class pack or membership to start booking.
            </p>
            <a
              href="/sweathouseoc/mission-viejo"
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: BRAND.primaryColor, color: '#000' }}
            >
              View Packages
            </a>
          </div>
        ) : (
          <>
            {/* Date Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={goToPreviousDay}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                disabled={datesWithClasses.findIndex(d => isSameDay(d, selectedDate)) === 0}
              >
                <ChevronLeft className="w-6 h-6 text-gray-400" />
              </button>
              
              <div className="text-center">
                <div className="text-white font-bold text-lg">
                  {formatShortDate(selectedDate)}
                </div>
              </div>
              
              <button
                onClick={goToNextDay}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                disabled={datesWithClasses.findIndex(d => isSameDay(d, selectedDate)) === datesWithClasses.length - 1}
              >
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Date Pills */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
              {datesWithClasses.slice(0, 14).map((date) => {
                const isSelected = isSameDay(date, selectedDate);
                const dayClasses = classesByDay[getDayKey(date.toISOString())] || [];
                const hasBooking = dayClasses.some(c => bookedClassIds.has(c.id));
                
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className="flex-shrink-0 px-3 py-2 rounded-lg text-center min-w-[60px] transition-all"
                    style={{
                      backgroundColor: isSelected ? BRAND.primaryColor : '#1a1a1a',
                      color: isSelected ? '#000' : '#fff',
                      border: hasBooking && !isSelected ? `1px solid ${BRAND.primaryColor}` : '1px solid #333',
                    }}
                  >
                    <div className="text-xs opacity-70">
                      {date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'America/Los_Angeles' })}
                    </div>
                    <div className="font-bold">
                      {date.getDate()}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Class List */}
            <div>
              {classesForSelectedDate.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                  <p className="text-gray-400">No classes scheduled for this day</p>
                </div>
              ) : (
                classesForSelectedDate.map((classInstance) => (
                  <ClassCard
                    key={classInstance.id}
                    classInstance={classInstance}
                    isBooked={bookedClassIds.has(classInstance.id)}
                    onBook={() => setSelectedClass(classInstance)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-gray-800">
        <div className="text-center">
          <span 
            className="text-xl"
            style={{ fontFamily: 'var(--font-pacifico), cursive', color: '#fff' }}
          >
            gymsense
          </span>
        </div>
      </footer>

      {/* Booking Confirmation Drawer */}
      {selectedClass && !showSuccess && (
        <BookingDrawer
          classInstance={selectedClass}
          creditsRemaining={totalCredits}
          onConfirm={handleBook}
          onClose={() => setSelectedClass(null)}
          isLoading={bookingLoading}
        />
      )}

      {/* Success Drawer */}
      {showSuccess && lastBookedClass && (
        <SuccessDrawer
          classInstance={lastBookedClass}
          onBookAnother={() => {
            setShowSuccess(false);
            setLastBookedClass(null);
          }}
          onClose={() => {
            setShowSuccess(false);
            setLastBookedClass(null);
          }}
        />
      )}
    </div>
  );
}
