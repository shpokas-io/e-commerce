import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseClient } from '@supabase/supabase-js';
import { Inject } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error('A user with this email is already registered.');
      }
      throw new Error(`Registration failed: ${error.message}`);
    }

    const userId = data.user?.id;
    if (!userId) {
      throw new Error('Failed to create user: Missing user ID.');
    }

    console.log('Register: Inserting user into database:', {
      id: userId,
      email,
    });

    const { error: dbError } = await this.supabase
      .from('users')
      .insert([{ id: data.user?.id, email }]);

    if (dbError) {
      console.error('Register: Failed to insert user metadata:', dbError);
      throw new Error('Failed to save user metadata in the database.');
    }

    const { data: syncedUser, error: syncError } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (syncError || !syncedUser) {
      console.error('Register: Failed to synchronize user:', syncError);
      throw new Error('User registration incomplete: Synchronization issue.');
    }

    console.log(
      'Register: User successfully created and synchronized:',
      syncedUser,
    );

    return {
      message: 'Registration successful. You can now log in.',
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const user = await this.supabase
      .from('users')
      .select('id, role')
      .eq('email', email)
      .single();

    if (!user.data) {
      console.error('User metadata not found for email:', email); //debug
      throw new UnauthorizedException('User metadata not found.');
    }

    const payload = { sub: user.data.id, email, role: user.data.role };
    console.log('Generated JWT Payload:', payload); //debug role problem
    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }
}
