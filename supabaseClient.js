// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gatwdwmlaeucgcxqcntd.supabase.co'; // from Step 4
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhdHdkd21sYWV1Y2djeHFjbnRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MDY1ODgsImV4cCI6MjA2MzM4MjU4OH0.C6Ie0l5vKSmJFB5PHHHg0dTFrpXdiQ-XjwwLt4IsMiI'; // from Step 4

export const supabase = createClient(supabaseUrl, supabaseKey);
