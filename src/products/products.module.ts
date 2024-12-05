import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsController } from './products.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PopulateProductsService } from './populate-products';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService, PopulateProductsService],
})
export class ProductsModule {}
