import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

export const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || '',
);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Supabase environment variables are missing!');
  throw new Error(
    'Ensure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in the .env file.',
  );
}
