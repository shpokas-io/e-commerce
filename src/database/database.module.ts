import { Module } from '@nestjs/common';
import { supabase } from 'src/config/supabase.config';

@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useValue: supabase,
    },
  ],
  exports: ['SUPABASE_CLIENT'],
})
export class DatabaseModule {}
