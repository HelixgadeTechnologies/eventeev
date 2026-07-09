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
  headers.set('Content-Type', req.headers.get('content-type') || 'application/json');
  
  if (token) {
    headers.set('x-auth-token', token);
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const arrayBuffer = await req.arrayBuffer();
    if (arrayBuffer.byteLength > 0) {
      body = arrayBuffer;
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const data = await response.text();
    let parsedData = data;
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      // not json
    }

    return NextResponse.json(parsedData, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ message: 'Proxy Error' }, { status: 500 });
  }
}
