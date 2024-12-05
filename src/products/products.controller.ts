import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtGuard } from '../common/guards/jwt.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { PopulateProductsService } from './populate-products';

@UseGuards(JwtGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly populateProductsService: PopulateProductsService,
  ) {}

  @Post()
  @Roles('admin')
  createPRoducts(@Body() dto: CreateProductDto) {
    console.log('Admin is creating a product.');
    return this.productsService.createProduct(dto);
  }

  @Get()
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

  @Post('populate')
  @Roles('admin')
  async populatePRoducts() {
    console.log('Admin triggered product population.');
    await this.populateProductsService.populateProducts();
    return { message: 'Product population completed successfully.' };
  }
}
