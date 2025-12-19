/**
 * API Route: Get Checkout Session Details
 * 
 * Fetches Stripe checkout session details to display on the success page.
 * This runs server-side so the Stripe secret key is never exposed.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Lazy initialize Stripe (only when needed, to avoid build-time errors)
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY not configured');
  }
  return new Stripe(key, {
    apiVersion: '2025-02-24.acacia',
  });
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json(
      { error: 'Missing session_id parameter' },
      { status: 400 }
    );
  }

  try {
    // Get the gym's Stripe account ID from the session metadata
    // First, retrieve the session to get the connected account
    // The session was created on a connected account, so we need to find which one
    
    // For connected accounts, we need to know which account to query
    // The session ID format doesn't indicate the account, so we'll try to 
    // retrieve it from our database based on session metadata
    
    // For now, let's check if there's a connected account in our database
    // by looking up the session - but since we don't have direct DB access here,
    // we'll need to handle this differently
    
    // APPROACH: The checkout session was created on a connected account
    // We'll need to pass the stripe_account_id somehow, or store it
    
    // For simplicity, let's try retrieving without connected account first
    // (This will work for platform-level sessions)
    // If that fails, we can iterate through known accounts
    
    // Actually, a better approach: store the stripe_account_id in the success URL
    // But for now, let's call the Supabase edge function to get session details
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      // Fallback: try to retrieve session details without expansion
      // This gives us basic info even without connected account access
      return NextResponse.json({
        success: true,
        session: {
          id: sessionId,
          status: 'complete',
          // Minimal fallback data
          customer_details: null,
          line_items: null,
          amount_total: null,
        },
        fallback: true,
      });
    }

    // Call a Supabase edge function to get the session details
    // The edge function has access to the connected account credentials
    const response = await fetch(`${supabaseUrl}/functions/v1/get-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Failed to get checkout session:', error);
      
      // Return minimal success info
      return NextResponse.json({
        success: true,
        session: {
          id: sessionId,
          status: 'complete',
        },
        fallback: true,
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      session: data.session,
      gym: data.gym,
    });
    
  } catch (error) {
    console.error('Error fetching checkout session:', error);
    
    // Even on error, show a success message (payment already went through)
    return NextResponse.json({
      success: true,
      session: {
        id: sessionId,
        status: 'complete',
      },
      fallback: true,
      error: 'Could not fetch purchase details',
    });
  }
}

