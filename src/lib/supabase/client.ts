// src/lib/supabase/client.ts
'use client'

import { createClient } from '@supabase/supabase-js'
import { useMemo } from 'react'
import { SUPABASE_CONFIG_MISSING_MESSAGE } from '@/lib/supabase/messages'

// Ortak env kontrolü
function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    // Bu mesaj projede zaten kullanılan metinle uyumlu
    throw new Error(SUPABASE_CONFIG_MISSING_MESSAGE || 'Supabase environment variables are not set.')
  }
  return { url, key }
}

// Tekil browser client oluşturucu
function _createBrowserClient() {
  const { url, key } = getEnv()
  return createClient(url, key)
}

/**
 * getBrowserClient()
 * - Eski kodda beklenen isim. Client Component içinden çağrılmalı.
 * - Her çağrıda taze instance üretir (cache’e ihtiyacın yoksa idealdir).
 */
export function getBrowserClient() {
  return _createBrowserClient()
}

/**
 * useSupabase()
 * - React hook: memoize edilerek tek instance döndürür.
 * - Client Component’lerde kullan.
 */
export function useSupabase() {
  const client = useMemo(() => _createBrowserClient(), [])
  return client
}

/**
 * supabase (default/simple export)
 * - Bazı dosyalar doğrudan `supabase` bekliyor olabilir.
 * - Client tarafta kullanılmak üzere “hazır” bir instance.
 */
export const supabase = _createBrowserClient()
