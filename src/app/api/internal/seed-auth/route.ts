// src/app/api/internal/seed-auth/route.ts
// Amaç: GoTrue Admin ile 7 kullanıcıyı seed eder. Ayrıntılı tanı mesajları döner.

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'           // Edge yerine Node (admin SDK için en stabil)
export const dynamic = 'force-dynamic'    // Cache olmasın

type Role = 'writer' | 'producer'
const USERS: Array<{ email: string; role: Role }> = [
  { email: 'senarist1@ducktylo.com', role: 'writer' },
  { email: 'senarist2@ducktylo.com', role: 'writer' },
  { email: 'senarist3@ducktylo.com', role: 'writer' },
  { email: 'senarist4@ducktylo.com', role: 'writer' },
  { email: 'senarist5@ducktylo.com', role: 'writer' },
  { email: 'yapimci1@ducktylo.com', role: 'producer' },
  { email: 'yapimci2@ducktylo.com', role: 'producer' },
]
const PASSWORD = '123456'

// Ortak tanı çıktısı
function diag(error?: any) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const sk  = process.env.SUPABASE_SERVICE_ROLE
  const tk  = process.env.ADMIN_SEED_TOKEN
  return {
    env: {
      NEXT_PUBLIC_SUPABASE_URL: url ? url.slice(0, 40) + '…' : '(unset)',
      SUPABASE_SERVICE_ROLE_set: !!sk,
      ADMIN_SEED_TOKEN_set: !!tk,
    },
    error: error ? String(error?.message || error) : undefined,
    stack: error?.stack?.toString?.().slice(0, 2000),
  }
}

async function _runSeed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE

  if (!url) throw new Error('ENV missing: NEXT_PUBLIC_SUPABASE_URL')
  if (!serviceKey) throw new Error('ENV missing: SUPABASE_SERVICE_ROLE')

  const admin = createClient(url, serviceKey)

  // Tüm kullanıcıları e-postaya göre bulmayı kolaylaştırmak için listUsers sayfalamayı basit tuttuk
  const list = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
  if (list.error) throw list.error

  const result: any[] = []
  for (const u of USERS) {
    const existing = list.data.users.find((x) => x.email?.toLowerCase() === u.email.toLowerCase())
    let userId: string | undefined

    if (!existing) {
      const res = await admin.auth.admin.createUser({
        email: u.email,
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { role: u.role },
      })
      if (res.error) throw res.error
      userId = res.data.user?.id
      result.push({ email: u.email, action: 'created', id: userId })
    } else {
      const res = await admin.auth.admin.updateUserById(existing.id, {
        password: PASSWORD,
        email_confirm: true,
        user_metadata: { role: u.role },
      })
      if (res.error) throw res.error
      userId = existing.id
      result.push({ email: u.email, action: 'updated', id: userId })
    }

    if (!userId) throw new Error(`No user id for ${u.email}`)

    const up = await admin
      .from('users')
      .upsert({ id: userId, email: u.email, role: u.role })
      .select('id, email, role')
      .single()
    if (up.error) throw up.error
  }

  return result
}

// Hem POST hem GET kabul edelim; GET ile test edenler için kolaylık
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization') || ''
    const provided = authHeader.replace(/^Bearer\s+/i, '')
    const token = process.env.ADMIN_SEED_TOKEN
    if (!token || provided !== token) {
      return NextResponse.json({ ok: false, reason: 'forbidden', ...diag() }, { status: 403 })
    }

    const result = await _runSeed()
    return NextResponse.json({ ok: true, result, ...diag() })
  } catch (e: any) {
    return NextResponse.json({ ok: false, ...diag(e) }, { status: 500 })
  }
}

export async function GET(req: Request) {
  // GET ile de aynı kontrol/çıktı (kullanışlı tanı için)
  return POST(req)
}
