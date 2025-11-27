import { NextRequest, NextResponse } from 'next/server';

// Apify API configuration
const APIFY_API_URL = 'https://api.apify.com/v2/acts/pipelinelabs~lead-scraper-apollo-zoominfo-lusha-ppe/run-sync-get-dataset-items';
const APIFY_TOKEN = process.env.APIFY_API_TOKEN || '';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // Lower limit for external API calls

// Simple in-memory rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Clean up old entries
  for (const [key, data] of requestCounts.entries()) {
    if (data.resetTime < windowStart) {
      requestCounts.delete(key);
    }
  }

  const clientData = requestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (clientData.resetTime < now) {
    // Reset the counter
    clientData.count = 0;
    clientData.resetTime = now + RATE_LIMIT_WINDOW;
  }

  clientData.count++;
  requestCounts.set(ip, clientData);

  return {
    allowed: clientData.count <= MAX_REQUESTS_PER_WINDOW,
    remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - clientData.count)
  };
}

interface LeadGenerationRequest {
  totalResults: number;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate request

    // Get client IP for rate limiting
    


    // Parse request body
    const body: LeadGenerationRequest = await request.json().catch(() => ({} as LeadGenerationRequest));
    
    // Validate required fields
    if (!body.totalResults || typeof body.totalResults !== 'number' || body.totalResults < 1 || body.totalResults > 50) {
      return NextResponse.json(
        { success: false, error: 'totalResults must be a number between 1 and 50' },
        { status: 400 }
      );
    }

    if (!APIFY_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Apify API token not configured' },
        { status: 500 }
      );
    }

    // Prepare request body for Apify API
    const apifyRequestBody = {
      hasEmail: true,
      hasPhone: true,
      personLocationCityIncludes: ['Mumbai'],
      personLocationCountryIncludes: ['India'],
      seniorityIncludes: ["Manager",
        "Director",
        "Founder",
        "Head",
        "VP"],
      resetSavedProgress: false,
      totalResults: body.totalResults
    };

    // Call Apify API
    const response = await fetch(`${APIFY_API_URL}?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apifyRequestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Apify API error:', errorData);
      return NextResponse.json(
        { success: false, error: `Apify API Error: ${response.status} - ${errorData.error || 'Unknown error'}` },
        { status: 502 }
      );
    }

    const leadsData = await response.json();

    // Log successful request (without sensitive data)

    return NextResponse.json({
      success: true,
      data: leadsData,
      message: 'Leads generated successfully',
    });

  } catch (error) {
    console.error('Lead generation error:', error);
    
    // Don't expose internal error details to client
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}