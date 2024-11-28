import { Controller, UseGuards, Patch, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UpdateEmailDto } from './dtos/update-email.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch()
  async updateProfile(
    @User('sub') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    console.log('Controller: Updating Profile for User:', userId);
    console.log('Controller: Update DTO:', dto);

    const updatedProfile = await this.profileService.updateProfile(userId, dto);
    return { message: 'Profile updated successfully', updatedProfile };
  }

  @Patch('email')
  async updateEmail(@User('sub') userId: string, @Body() dto: UpdateEmailDto) {
    console.log('Controller: User ID from JWT:', userId);
    console.log('Controller: Profile Update Payload:', dto);

    return this.profileService.updateEmail(userId, dto);
  }

  @Patch('password')
  async updatePassword(
    @User('sub') userId: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.profileService.updatePassword(userId, dto);
  }
}
