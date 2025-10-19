// app/api/seed-demo-users/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const DEMO_SECRET = process.env.SEED_DEMO_SECRET; // endpoint koruması

const accounts = [
  { email: 'senarist1@ducktylo.com', role: 'writer' },
  { email: 'senarist2@ducktylo.com', role: 'writer' },
  { email: 'senarist3@ducktylo.com', role: 'writer' },
  { email: 'senarist4@ducktylo.com', role: 'writer' },
  { email: 'senarist5@ducktylo.com', role: 'writer' },
  { email: 'yapimci1@ducktylo.com', role: 'producer' },
  { email: 'yapimci2@ducktylo.com', role: 'producer' },
];

export async function POST(req: Request) {
  const headerSecret = req.headers.get('x-seed-secret');
  if (!DEMO_SECRET || headerSecret !== DEMO_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: Array<Record<string, unknown>> = [];

  for (const a of accounts) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: a.email,
      password: '123456',
      email_confirm: true,
      user_metadata: { role: a.role },
    });
    if (error) {
      // Eğer kullanıcı zaten varsa, devam edip public.users upsert deneyelim
      results.push({ email: a.email, status: 'createUser-error', error: error.message });
    } else {
      results.push({ email: a.email, status: 'created', id: data.user?.id });
    }
  }

  // auth.users -> public.users trigger zaten var; emniyet olsun diye upsert:
  for (const a of accounts) {
    // id'yi auth.users'dan çek
    const { data: udata, error: uerr } = await supabaseAdmin
      .from('users')
      .upsert({ id: undefined as unknown as string, email: a.email, role: a.role }) // id yoksa trigger insert eder
      .select('id, email, role')
      .eq('email', a.email)
      .maybeSingle();

    results.push({ email: a.email, profileUpsert: uerr ? uerr.message : 'ok', row: udata });
  }

  return NextResponse.json({ ok: true, results });
}
