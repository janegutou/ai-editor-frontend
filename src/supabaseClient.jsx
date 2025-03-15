import { createClient } from '@supabase/supabase-js';

// Supabase configuration

const supabaseUrl = "https://jbmzezulnwplmavyvyyt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibXplenVsbndwbG1hdnl2eXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDk4MjQsImV4cCI6MjA1NzQ4NTgyNH0.Am8BBmaVCv1OCPGD2q44fvE04PzYYofEDPGEi3HDy5s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
