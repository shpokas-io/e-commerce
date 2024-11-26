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
      throw new Error(`Registration failed: ${error.message}`);
    }

    // Add user metadata (optional)
    await this.supabase.from('users').insert([{ id: data.user?.id, email }]);

    return {
      message: 'Registration successful. Please verify your email.',
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
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: data.user?.id, email };
    const accessToken = this.jwtService.sign(payload);

    return { access_token: accessToken };
  }
}
