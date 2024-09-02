// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mfmagjdjmvvmlnymneby.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mbWFnamRqbXZ2bWxueW1uZWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzMTY2OTEsImV4cCI6MjA0MDg5MjY5MX0.Jwxy_GWaKpRrt6bkeRoe8dY0_xilxLqZqiqNRSqPYc0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);