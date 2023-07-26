import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname
  if (url.startsWith('/admin') && !url.startsWith('/admin/login')) {
    if (request.cookies.get('admin-token')) {

    } else {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
}
