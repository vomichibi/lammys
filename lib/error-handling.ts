import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  status: number;
}

export function handleApiError(error: unknown, defaultMessage: string = 'An error occurred'): NextResponse {
  console.error(`API Error: ${defaultMessage}`, error);
  
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  const status = errorMessage === 'Unauthorized' ? 403 : 500;
  
  return NextResponse.json(
    { error: defaultMessage },
    { status }
  );
}
