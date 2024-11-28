import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UpdateEmailDto } from './dtos/update-email.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly databaseService: DatabaseService) {}

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    console.log('Service: Received User ID:', userId);
    console.log('Service: Received DTO:', dto);

    // Ensure user exists in the database
    const { data: existingUser, error: userError } =
      await this.databaseService.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (userError || !existingUser) {
      console.error('Service: User not found in the database:', userError);
      throw new NotFoundException('User not found');
    }

    console.log('Service: Existing User Before Update:', existingUser);

    // Proceed with the update
    const { data: updatedData, error: updateError } =
      await this.databaseService.supabase
        .from('users')
        .update(dto)
        .eq('id', userId)
        .select();

    if (updateError) {
      console.error('Service: Supabase Error during update:', updateError);
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }

    // Re-fetch user to confirm changes
    const { data: refreshedUser, error: refreshError } =
      await this.databaseService.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (refreshError || !refreshedUser) {
      console.error('Service: Failed to fetch updated user:', refreshError);
      throw new NotFoundException('Failed to fetch updated user');
    }

    console.log('Service: Profile updated successfully:', refreshedUser);
    return refreshedUser;
  }

  async updateEmail(userId: string, dto: UpdateEmailDto) {
    const { data: existingUser, error: userError } =
      await this.databaseService.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (userError || !existingUser) {
      console.error('Service: User not found in the database:', userError);
      throw new NotFoundException('User not found');
    }

    const { error } = await this.databaseService.supabase.auth.updateUser({
      email: dto.newEmail,
    });

    if (error) {
      throw new Error(`Failed to update email: ${error.message}`);
    }

    return { message: 'Email updated successfully' };
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const { error: authError } =
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
