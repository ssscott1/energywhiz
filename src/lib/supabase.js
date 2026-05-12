import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars not set — CRM will run in local-only mode.')
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ─── Leads ───────────────────────────────────────────────────────────────────

export async function fetchLeads() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('leads')
    .select('*, lead_notes(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createLead(lead) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateLeadStage(id, stage) {
  if (!supabase) return
  const { error } = await supabase
    .from('leads')
    .update({ stage })
    .eq('id', id)
  if (error) throw error
}

export async function updateLeadFinanceStatus(id, financeStatus) {
  if (!supabase) return
  const { error } = await supabase
    .from('leads')
    .update({ finance_status: financeStatus })
    .eq('id', id)
  if (error) throw error
}

// ─── Notes ───────────────────────────────────────────────────────────────────

export async function addLeadNote(leadId, content, authorId) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('lead_notes')
    .insert({ lead_id: leadId, content, author_id: authorId })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}
