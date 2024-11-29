import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { User } from '../common/decorators/user.decorator';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';

@UseGuards(JwtGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createORder(@User('sub') userId: string, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(userId, dto);
  }

  @Get('my')
  async getUserOrders(@User('sub') userId: string) {
    return this.ordersService.getUserOrders(userId);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, dto);
  }
}
