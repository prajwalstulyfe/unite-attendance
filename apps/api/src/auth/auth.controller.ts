import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto.js';
import { Public } from './decorators/public.decorator.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

interface GoogleUserReq extends Request {
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    const data = await this.authService.refreshTokens(dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body('email') email: string) {
    const data = await this.authService.forgotPassword(email);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Triggers Google OAuth 2.0 flow redirect
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: GoogleUserReq, @Res() res: Response) {
    const host = req.headers?.host || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

    const defaultAdminUrl = isLocalhost ? 'http://localhost:3002' : 'https://admin.unite-attendance.com';
    const defaultAppUrl = isLocalhost ? 'http://localhost:3000' : 'https://app.unite-attendance.com';

    const adminUrl = process.env['NEXT_PUBLIC_ADMIN_URL'] || defaultAdminUrl;
    const appUrl = process.env['NEXT_PUBLIC_APP_URL'] || defaultAppUrl;
    const state = (req.query?.state as string) || '';
    const referer = req.headers?.referer || '';
    const isAdmin = state.includes('admin') || referer.includes('admin');
    const frontendUrl = isAdmin ? adminUrl : appUrl;

    try {
      const googleUser = req.user || { email: '', firstName: '', lastName: '' };
      const tokens = await this.authService.validateGoogleUser(googleUser);
      return res.redirect(`${frontendUrl}/login?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`);
    } catch (err: unknown) {
      const errorMsg = encodeURIComponent((err as Error)?.message || 'Google Authentication Failed');
      return res.redirect(`${frontendUrl}/login?error=${errorMsg}`);
    }
  }

  @Get('me')
  async getMe(@CurrentUser('id') userId: string) {
    const data = await this.authService.getMe(userId);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return { success: true, message: 'Logged out successfully', timestamp: new Date().toISOString() };
  }
}
