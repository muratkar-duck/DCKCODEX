// src/app/api/internal/seed-auth/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type Role = 'writer' | 'producer'
type SeedAction = 'created' | 'updated'

type SeedResult = {
  email: string
  action: SeedAction
  id: string | null
}

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

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE
    const token = process.env.ADMIN_SEED_TOKEN

    const authHeader = req.headers.get('authorization') || ''
    const provided = authHeader.replace(/^Bearer\s+/i, '')

    if (!url || !serviceKey || !token || provided !== token) {
      return NextResponse.json({ ok: false, error: 'forbidden' }, { status: 403 })
    }

    const admin = createClient(url, serviceKey)

    const result: SeedResult[] = []

    const list = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
    if (list.error) throw list.error

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
        result.push({ email: u.email, action: 'created', id: userId ?? null })
      } else {
        const res = await admin.auth.admin.updateUserById(existing.id, {
          password: PASSWORD,
          email_confirm: true,
          user_metadata: { role: u.role },
        })
        if (res.error) throw res.error
        userId = existing.id
        result.push({ email: u.email, action: 'updated', id: userId ?? null })
      }

      if (!userId) throw new Error(`No user id for ${u.email}`)

      const up = await admin
        .from('users')
        .upsert({ id: userId, email: u.email, role: u.role })
        .select('id, email, role')
        .single()
      if (up.error) throw up.error
    }

    return NextResponse.json({ ok: true, result })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
