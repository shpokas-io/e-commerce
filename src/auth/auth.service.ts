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

    try {
      await this.supabase.from('users').insert([{ id: data.user?.id, email }]);
    } catch {
      throw new Error('Failed to save user metadatat the database.');
    }

    return {
      message: 'Registration successful. You can now log in.',
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new UnauthorizedException('Invalid email or password.');
      }
      throw new UnauthorizedException(`Login failed: ${error.message}`);
    }

    const payload = { sub: data.user?.id, email };
    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }
}
