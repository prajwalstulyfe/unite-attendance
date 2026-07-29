import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
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
