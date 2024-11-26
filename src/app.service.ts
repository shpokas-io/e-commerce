import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    const result = await this.databaseService.testConnection();
    console.log(result);
  }
}
