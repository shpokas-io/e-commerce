import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import { AuthDto } from './auth.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  getProfile(@User() user: any) {
    return { message: 'Authenticated user', user };
  }
}
