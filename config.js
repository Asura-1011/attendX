/**
 * AttendX Pro - Supabase Database Environment Configuration
 * 
 * Connected Project: https://riwniprkudzettfdwswa.supabase.co
 */

window.ENV = {
  SUPABASE_URL: "https://riwniprkudzettfdwswa.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_0tz-b3U2AUqaarIBjce74Q_grfgcPnL"
};

// Initialize Global Supabase SDK Client
if (window.supabase && window.supabase.createClient) {
  window.supabaseClient = window.supabase.createClient(window.ENV.SUPABASE_URL, window.ENV.SUPABASE_ANON_KEY);
}
