// Supabase Client Integration with Resilient Fallback
// Supports both CDN window.supabase and local storage persistence

const SUPABASE_URL = localStorage.getItem('printora_supabase_url') || '';
const SUPABASE_ANON_KEY = localStorage.getItem('printora_supabase_anon_key') || '';

let supabaseInstance = null;

if (typeof window !== 'undefined' && window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http')) {
  try {
    supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    console.log('✅ Connected to Supabase backend:', SUPABASE_URL);
  } catch (err) {
    console.warn('⚠️ Supabase init warning, running in local cached mode:', err.message);
  }
} else {
  console.info('ℹ️ Running in Local Storage Mode. Add Supabase URL & Anon Key in Admin Settings to enable cloud sync.');
}

export const supabase = supabaseInstance;

export function isSupabaseConfigured() {
  return !!supabaseInstance;
}

export function updateSupabaseCredentials(url, key) {
  if (url && key) {
    localStorage.setItem('printora_supabase_url', url.trim());
    localStorage.setItem('printora_supabase_anon_key', key.trim());
    window.location.reload();
  }
}
