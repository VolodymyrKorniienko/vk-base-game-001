import { NextRequest, NextResponse } from 'next/server';

const CDP_PAYMASTER_URL = process.env.CDP_PAYMASTER_URL;

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!CDP_PAYMASTER_URL) {
    return NextResponse.json(
      { error: 'Paymaster service not configured' },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(CDP_PAYMASTER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Paymaster proxy error:', error);
    return NextResponse.json(
      { error: 'Paymaster request failed' },
      { status: 502 },
    );
  }
}
