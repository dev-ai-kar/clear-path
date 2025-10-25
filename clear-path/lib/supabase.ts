import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gzoygboezhvaemffkxed.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6b3lnYm9lemh2YWVtZmZreGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDg3NzIsImV4cCI6MjA3Njk4NDc3Mn0.gv7RrhTPRwqVaSJ2of-aCL6Ebw_hG12UzUBcNt1FsCI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
