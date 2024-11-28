import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UpdateEmailDto } from './dtos/update-email.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: DatabaseService) {}

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const { data, error } = await this.databaseService.supabase
      .from('users')
      .update(dto)
      .eq('id', userId)
      .select();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data[0];
  }

  async updateEmail(userId: string, dto: UpdateEmailDto) {
    const { data, error } = await this.databaseService.supabase.auth.updateUser(
      { email: dto.newEmail },
    );

    if (error) {
      throw new Error(`Failed to update email: ${error.message}`);
    }

    await this.databaseService.supabase
      .from('users')
      .update({ email: dto.newEmail })
      .eq('id', userId);

    return data;
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const { data: user, error: authError } =
      await this.databaseService.supabase.auth.signInWithPassword({
        email: userId,
        password: dto.currentPassword,
      });

    if (authError) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const { error } = await this.databaseService.supabase.auth.updateUser({
      password: dto.newPassword,
    });

    if (error) {
      throw new Error(`Failed to update password: ${error.message}`);
    }

    return { message: 'Password updated successfully' };
  }
}
