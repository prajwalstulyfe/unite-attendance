import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto.js';
import { Public } from './decorators/public.decorator.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return { success: true, data, timestamp: new Date().toISOString() };
  }

  @Public()
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
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Triggers Google OAuth 2.0 flow redirect
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const adminUrl = process.env['NEXT_PUBLIC_ADMIN_URL'] || 'https://admin.unite-attendance.com';
    const appUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'https://app.unite-attendance.com';
    const state = req.query?.state || '';
    const referer = req.headers?.referer || '';
    const frontendUrl = (state.includes('admin') || referer.includes('admin')) ? adminUrl : appUrl;

    try {
      const tokens = await this.authService.validateGoogleUser(req.user);
      return res.redirect(`${frontendUrl}/login?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`);
    } catch (err: any) {
      const errorMsg = encodeURIComponent(err.message || 'Google Authentication Failed');
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
