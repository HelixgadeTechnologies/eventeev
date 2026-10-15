import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eventeevapi.onrender.com';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, await params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, await params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, await params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, await params);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxyRequest(req, await params);
}

async function handleProxyRequest(req: NextRequest, params: { path: string[] }) {
  const path = params.path.join('/');
  const token = req.cookies.get('x-auth-token')?.value;

  const url = new URL(req.url);
  const searchParams = url.search;
  
  const targetUrl = `${API_BASE_URL}/${path}${searchParams}`;

  const headers = new Headers();
  const incomingContentType = req.headers.get('content-type');
  if (incomingContentType) {
    headers.set('Content-Type', incomingContentType);
  }
  
  if (token) {
    headers.set('x-auth-token', token);
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchInit: RequestInit & { duplex?: 'half' } = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    fetchInit.body = req.body;
    fetchInit.duplex = 'half';
  }

  try {
    const response = await fetch(targetUrl, fetchInit as RequestInit);

    const responseHeaders = new Headers();
    const contentType = response.headers.get('content-type');
    if (contentType) responseHeaders.set('content-type', contentType);
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) responseHeaders.set('cache-control', cacheControl);

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ message: 'Proxy Error' }, { status: 500 });
  }
}
