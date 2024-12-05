import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PopulateProductsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly httpService: HttpService,
  ) {}

  async fetchProductsFromAPI(): Promise<any[]> {
    const apiUrl = 'https://fakestoreapi.com/products';
    console.log(`Fetching products from: ${apiUrl}`);
    const response = await firstValueFrom(this.httpService.get(apiUrl));
    return response.data;
  }

  async populateProducts(): Promise<void> {
    console.log('Starting product population...');

    // Fetch products from the API
    const products = await this.fetchProductsFromAPI();

    // Transform products into the format for Supabase
    const transformedProducts = products.map((product) => ({
      name: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      image_url: product.image,
    }));

    console.log(
      `Transformed ${transformedProducts.length} products for Supabase.`,
    );

    // Insert into Supabase
    const { data, error } = await this.databaseService.supabase
      .from('products')
      .insert(transformedProducts)
      .select();

    if (error) {
      console.error('Error inserting products into Supabase:', error.message);
      throw new Error('Failed to insert products into Supabase.');
    }

    console.log(`Successfully populated ${data.length} products.`);
  }
}
