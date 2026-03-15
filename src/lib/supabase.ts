import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://rxtliptayixidaiwmjpa.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjUxYmE3ZTk5LTlhN2ItNGExMi04YWMxLWMyOWZkOTY2YjFmNCJ9.eyJwcm9qZWN0SWQiOiJyeHRsaXB0YXlpeGlkYWl3bWpwYSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzczNTY0OTc5LCJleHAiOjIwODg5MjQ5NzksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.KqTMzdbOV5JOsvDf3nAkTrlC4cm5FJ0scUtm2ZLZSG0';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };