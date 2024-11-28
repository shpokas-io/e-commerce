import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createProduct(dto: CreateProductDto) {
    const { data, error } = await this.databaseService.supabase
      .from('products')
      .insert(dto)
      .select();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return data[0];
  }

  async getAllProducts() {
    const { data, error } = await this.databaseService.supabase
      .from('products')
      .select();

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data;
  }

  async getProductById(id: string) {
    const { data, error } = await this.databaseService.supabase
      .from('products')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return data;
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const { data, error } = await this.databaseService.supabase
      .from('products')
      .update(dto)
      .eq('id', id)
      .select();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return data[0];
  }

  async deleteProduct(id: string) {
    const { error } = await this.databaseService.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }

    return { message: 'Product deleted successfully' };
  }
}
