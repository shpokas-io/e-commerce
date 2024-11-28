import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { supabase } from 'src/config/supabase.config';

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
