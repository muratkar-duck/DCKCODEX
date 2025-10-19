// src/app/debug-auth/page.tsx
'use client'

import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

type Step = 'idle' | 'signing' | 'done' | 'error'
type Role = 'writer' | 'producer'

type RoleRow = {
  id: string
  email: string
  role: Role
} | null

type MaskedSession = (Session & { access_token: string | null }) | null

type DebugResult = {
  authUserEmail: string | null
  authUserId: string | null
  roleRow: RoleRow
  session: MaskedSession
}

export default function DebugAuthPage() {
  const [email, setEmail] = useState('senarist1@ducktylo.com')
  const [password, setPassword] = useState('123456')
  const [step, setStep] = useState<Step>('idle')
  const [result, setResult] = useState<DebugResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setStep('signing'); setError(null); setResult(null)
    try {
      await supabase.auth.signOut()

      const { data: signIn, error: authErr } = await supabase.auth.signInWithPassword({ email, password })
      if (authErr) { setStep('error'); setError(`signIn error: ${authErr.message}`); return }

      const { data: userData } = await supabase.auth.getUser()
      const uid = userData.user?.id
      let roleRow: RoleRow = null
      if (uid) {
        const { data: row, error: roleErr } = await supabase
          .from('users')
          .select('id, email, role')
          .eq('id', uid)
          .maybeSingle()
        if (roleErr) { setStep('error'); setError(`role select error: ${roleErr.message}`); return }
        roleRow = row as RoleRow
      }

      const maskedSession: MaskedSession = signIn.session ? { ...signIn.session, access_token: '***' } : null

      setResult({
        authUserEmail: userData.user?.email ?? null,
        authUserId: userData.user?.id ?? null,
        roleRow,
        session: maskedSession,
      })
      setStep('done')
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      setStep('error'); setError(message)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setStep('idle'); setResult(null); setError(null)
  }

  return (
    <div className="min-h-screen p-6 flex items-start justify-center bg-[#0b1020] text-white">
      <div className="w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">Debug Auth</h1>

        <div className="grid grid-cols-1 gap-3 bg-white/5 p-4 rounded-xl">
          <label className="text-sm opacity-80">Email</label>
          <input className="px-3 py-2 rounded-md text-black" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="text-sm opacity-80">Password</label>
          <input type="password" className="px-3 py-2 rounded-md text-black" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex gap-2 pt-2">
            <button onClick={handleSignIn} disabled={step === 'signing'} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50">
              {step === 'signing' ? 'Signing in…' : 'Sign in'}
            </button>
            <button onClick={handleSignOut} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700">Sign out</button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-md">
            <div className="font-semibold">Error</div>
            <pre className="whitespace-pre-wrap text-sm">{error}</pre>
          </div>
        )}

        {step === 'done' && (
          <div className="bg-white/5 p-3 rounded-md">
            <div className="font-semibold mb-2">Result</div>
            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
