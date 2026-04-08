import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://mfucdlmvhncetfozgqbp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mdWNkbG12aG5jZXRmb3pncWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTIxNTEsImV4cCI6MjA5MDQ2ODE1MX0.lkslG9vMQ17Wh5231UdZh_7iHSuWDk6KQTzKEzKlw6U'
)
