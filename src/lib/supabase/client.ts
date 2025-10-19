// src/lib/supabase/client.ts
'use client'

import { createClient } from '@supabase/supabase-js'
import { useMemo } from 'react'
import { SUPABASE_CONFIG_MISSING_MESSAGE } from '@/lib/supabase/messages'

function getEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(SUPABASE_CONFIG_MISSING_MESSAGE || 'Supabase environment variables are not set.')
  }
  return { url, key }
}

function _createBrowserClient() {
  const { url, key } = getEnv()
  return createClient(url, key)
}

export function getBrowserClient() {
  return _createBrowserClient()
}

export function useSupabase() {
  const client = useMemo(() => _createBrowserClient(), [])
  return client
}

export const supabase = _createBrowserClient()
