import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const { data: order, error: orderError } =
      await this.databaseService.supabase
        .from('orders')
        .insert([{ user_id: userId, total: dto.total }])
        .select();

    if (orderError) throw new Error('Failed to create order.');

    const orderId = order[0].id;

    const items = dto.items.map((item) => ({
      ...item,
      order_id: orderId,
    }));

    const { error: itemsError } = await this.databaseService.supabase
      .from('order_items')
      .insert(items);

    if (itemsError) throw new Error('Failed to add order items.');

    return { message: `Order created successfully`, order: order[0] };
  }

  async getUserOrders(userId: string) {
    const { data, error } = await this.databaseService.supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error('Failed to fetch user orders.');
    return data;
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const { error } = await this.databaseService.supabase
      .from('orders')
      .update({ status: dto.status })
      .eq('id', orderId);

    if (error) throw new Error('Failed to update order status.');
    return { message: 'Order status updated successfully' };
  }
}
