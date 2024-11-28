import { Module } from '@nestjs/common';
import { supabase } from 'src/config/supabase.config';
import { DatabaseService } from './database.service';

@Module({
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      useValue: supabase,
    },
    DatabaseService,
  ],
  exports: ['SUPABASE_CLIENT', DatabaseService],
})
export class DatabaseModule {}
