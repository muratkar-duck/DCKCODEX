// src/app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL || '(unset)'
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '(unset)'
  return NextResponse.json({
    ok: true,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: url,
      NEXT_PUBLIC_SUPABASE_ANON_KEY_prefix: anon === '(unset)' ? '(unset)' : anon.slice(0, 10) + '...',
    },
  })
}
