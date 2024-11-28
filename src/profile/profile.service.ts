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

    const { data: updatedData, error: updateError } =
      await this.databaseService.supabase
        .from('users')
        .update({ name: dto.name, address: dto.address })
        .eq('id', userId)
        .select();

    if (updateError) {
      console.error('Service: Supabase Error during update:', updateError);
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }

    if (!updatedData || updatedData.length === 0) {
      console.error('Service: No changes made for ID:', userId);
      throw new NotFoundException('No changes made to the profile');
    }

    console.log('Service: Profile updated successfully:', updatedData[0]);
    return updatedData[0];
  }

  async updateEmail(userId: string, dto: UpdateEmailDto) {
    console.log('Service: Updating email for User ID:', userId);
    console.log('Service: New Email:', dto.newEmail);

    const { error: authError } =
      await this.databaseService.supabase.auth.admin.updateUserById(userId, {
        email: dto.newEmail,
      });

    if (authError) {
      console.error(
        'Service: Error updating email in Supabase Auth:',
        authError,
      );
      throw new Error(`Failed to update email: ${authError.message}`);
    }

    const { data, error } = await this.databaseService.supabase
      .from('users')
      .update({ email: dto.newEmail })
      .eq('id', userId)
      .select();

    console.log('Supabase Query Response:', { data, error });

    if (error) {
      console.error('Service: Error updating email in users table:', error);
      throw new Error(`Failed to persist email in database: ${error.message}`);
    }

    console.log('Service: Email updated successfully:', data[0]);
    return { message: 'Email updated successfully', updatedProfile: data[0] };
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    console.log('Service: Updating password for User ID:', userId);

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

    console.log('Service: Password updated successfully for User ID:', userId);
    return { message: 'Password updated successfully' };
  }
}
