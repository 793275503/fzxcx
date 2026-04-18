import { supabase } from '@/lib/supabase'
import type { ContactSubmission, ContactFormInput } from '@/types/database'

export async function submitContactForm(input: ContactFormInput) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .insert({
      name: input.name,
      phone: input.phone,
      costume_type: input.costume_type,
      message: input.message,
      status: 'new',
    })
    .select()
    .single()
  if (error) throw error
  return data as ContactSubmission
}

export async function fetchSubmissions() {
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as ContactSubmission[]
}

export async function updateSubmissionStatus(id: string, status: ContactSubmission['status']) {
  const updates: Partial<ContactSubmission> = { status }
  if (status === 'read') updates.read_at = new Date().toISOString()
  const { data, error } = await supabase
    .from('contact_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as ContactSubmission
}

export async function updateSubmissionNotes(id: string, notes: string) {
  const { data, error } = await supabase
    .from('contact_submissions')
    .update({ notes })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as ContactSubmission
}
