import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class DatabaseService {
  constructor(@Inject('SUPABASE_CLIENT') readonly supabase: SupabaseClient) {}

  async testConnection(): Promise<string> {
    const { data, error } = await this.supabase.from('pg_tables').select('*');
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return 'Connection failed';
    }
    console.log('Supabase connection successful', data);
    return 'Connection successful';
  }
}
