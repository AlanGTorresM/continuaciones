import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
//supabase
//FesAragon2004.
const supabaseUrl = "https://kuwcitnkpoolemvawwel.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1d2NpdG5rcG9vbGVtdmF3d2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwOTEwNjUsImV4cCI6MjA0NzY2NzA2NX0.NXZ1Y7SWRTPYBDC_bSXz1JJCkTzY5Hroe4X8ws3BeZY";
// Crear cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
