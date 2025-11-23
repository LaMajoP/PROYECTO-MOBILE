// lib/supabaseClient.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zqvioqoafbatkbixfsqz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TM1P1dlXm1yCbAy5NWlNDw_GRyRc_Vr';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

