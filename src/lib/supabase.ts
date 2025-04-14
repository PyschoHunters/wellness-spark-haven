
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zrzkpoysgsybrkuennkd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyemtwb3lzZ3N5YnJrdWVubmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5MjMxNzksImV4cCI6MjA1OTQ5OTE3OX0.IcM6TeQW_8Gh9lWBEogljfG_iaBGP7J7W19SPkXWADo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
